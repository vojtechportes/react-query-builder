import type {
  IDenormalizedRuleNode,
  QueryGroupValue,
  QueryOperator,
} from '../../utils/query-tree';
import type {
  IODataToken,
  IParsedODataGroup,
  ODataTokenType,
  ParsedODataNode,
} from './odata-token.types';
import { inferODataStringOperator } from './shared';
import { tokenizeOData } from './tokenize-odata';

export class ODataParser {
  private readonly tokens: IODataToken[];
  private index = 0;

  constructor(input: string) {
    this.tokens = tokenizeOData(input);
  }

  public parse(): ParsedODataNode[] {
    if (this.peek().type === 'EOF') {
      return [];
    }

    const expression = this.parseOr();
    this.expect('EOF');
    return [expression];
  }

  private parseOr(): ParsedODataNode {
    let left = this.parseAnd();

    while (this.isKeyword('or')) {
      this.consume();
      left = this.combine('OR', left, this.parseAnd());
    }

    return left;
  }

  private parseAnd(): ParsedODataNode {
    let left = this.parseNot();

    while (this.isKeyword('and')) {
      this.consume();
      left = this.combine('AND', left, this.parseNot());
    }

    return left;
  }

  private parseNot(): ParsedODataNode {
    if (!this.isKeyword('not')) {
      return this.parsePrimary();
    }

    this.consume();
    const operand = this.parsePrimary();

    if (this.isRuleNode(operand)) {
      if (operand.operator === 'CONTAINS') {
        return { ...operand, operator: 'NOT_CONTAINS' };
      }

      if (operand.operator === 'LIKE') {
        return { ...operand, operator: 'NOT_LIKE' };
      }
    }

    if (this.isParsedGroup(operand)) {
      return {
        ...operand,
        isNegated: !operand.isNegated,
      };
    }

    return {
      kind: 'group',
      combinator: 'AND',
      isNegated: true,
      children: [operand],
    };
  }

  private parsePrimary(): ParsedODataNode {
    if (this.peek().type === 'LPAREN') {
      this.consume();
      const expression = this.parseOr();
      this.expect('RPAREN');
      return expression;
    }

    if (this.isFunctionName()) {
      return this.parseFunctionExpression();
    }

    return this.parseComparison();
  }

  private parseFunctionExpression(): ParsedODataNode {
    const functionName = this.expect('IDENTIFIER').value;
    this.expect('LPAREN');
    const field = this.parseIdentifier();
    this.expect('COMMA');
    const value = this.parseStringValue();
    this.expect('RPAREN');

    if (
      functionName !== 'contains' &&
      functionName !== 'startswith' &&
      functionName !== 'endswith'
    ) {
      throw new Error(`Unsupported OData function "${functionName}".`);
    }

    return {
      field,
      ...inferODataStringOperator(functionName, value),
    };
  }

  private parseComparison(): IDenormalizedRuleNode {
    const field = this.parseIdentifier();
    const operator = this.expectKeywordValue([
      'eq',
      'ne',
      'gt',
      'ge',
      'lt',
      'le',
    ]);
    const value = this.parseScalarValue();

    if (operator === 'eq' && value === null) {
      return { field, operator: 'IS_NULL' };
    }

    if (operator === 'ne' && value === null) {
      return { field, operator: 'IS_NOT_NULL' };
    }

    return {
      field,
      operator: this.mapOperator(operator),
      value: value as Exclude<typeof value, null>,
    };
  }

  private parseIdentifier(): string {
    const token = this.consume();

    if (token.type !== 'IDENTIFIER') {
      throw new Error(`Expected a field identifier but found "${token.value}".`);
    }

    return token.value;
  }

  private parseScalarValue(): string | number | boolean | null {
    const token = this.consume();

    if (token.type === 'STRING') {
      return token.value;
    }

    if (token.type === 'NUMBER') {
      return Number(token.value);
    }

    if (token.type === 'KEYWORD' && token.value === 'true') {
      return true;
    }

    if (token.type === 'KEYWORD' && token.value === 'false') {
      return false;
    }

    if (token.type === 'KEYWORD' && token.value === 'null') {
      return null;
    }

    throw new Error(`Expected a scalar value but found "${token.value}".`);
  }

  private parseStringValue(): string {
    const value = this.parseScalarValue();

    if (typeof value !== 'string') {
      throw new Error(`Expected a string value but found "${value}".`);
    }

    return value;
  }

  private mapOperator(value: string): QueryOperator {
    switch (value) {
      case 'eq':
        return 'EQUAL';
      case 'ne':
        return 'NOT_EQUAL';
      case 'gt':
        return 'LARGER';
      case 'ge':
        return 'LARGER_EQUAL';
      case 'lt':
        return 'SMALLER';
      case 'le':
        return 'SMALLER_EQUAL';
      default:
        throw new Error(`Unsupported OData operator "${value}".`);
    }
  }

  private combine(
    combinator: QueryGroupValue,
    left: ParsedODataNode,
    right: ParsedODataNode
  ): ParsedODataNode {
    const collapsed = this.tryCollapse(combinator, left, right);

    if (collapsed) {
      return collapsed;
    }

    const children: ParsedODataNode[] = [];

    if (this.isParsedGroup(left) && !left.isNegated && left.combinator === combinator) {
      children.push(...left.children);
    } else {
      children.push(left);
    }

    if (this.isParsedGroup(right) && !right.isNegated && right.combinator === combinator) {
      children.push(...right.children);
    } else {
      children.push(right);
    }

    return {
      kind: 'group',
      combinator,
      isNegated: false,
      children,
    };
  }

  private tryCollapse(
    combinator: QueryGroupValue,
    left: ParsedODataNode,
    right: ParsedODataNode
  ): IDenormalizedRuleNode | null {
    if (!this.isRuleNode(left) || !this.isRuleNode(right) || left.field !== right.field) {
      return null;
    }

    if (
      combinator === 'AND' &&
      left.operator === 'LARGER_EQUAL' &&
      right.operator === 'SMALLER_EQUAL'
    ) {
      return {
        field: left.field,
        operator: 'BETWEEN',
        value: [left.value, right.value] as string[] | number[],
      };
    }

    if (
      combinator === 'OR' &&
      left.operator === 'SMALLER' &&
      right.operator === 'LARGER'
    ) {
      return {
        field: left.field,
        operator: 'NOT_BETWEEN',
        value: [left.value, right.value] as string[] | number[],
      };
    }

    if (
      left.operator === 'CONTAINS' &&
      right.operator === 'CONTAINS' &&
      left.field === right.field
    ) {
      return {
        field: left.field,
        operator: combinator === 'AND' ? 'ALL_IN' : 'ANY_IN',
        value: [left.value, right.value] as string[] | number[],
      };
    }

    if (
      left.operator === 'EQUAL' &&
      right.operator === 'EQUAL' &&
      left.field === right.field
    ) {
      return {
        field: left.field,
        operator: combinator === 'OR' ? 'IN' : 'ALL_IN',
        value: [left.value, right.value] as string[] | number[],
      };
    }

    return null;
  }

  private isRuleNode(node: ParsedODataNode): node is IDenormalizedRuleNode {
    return !this.isParsedGroup(node);
  }

  private isParsedGroup(node: ParsedODataNode): node is IParsedODataGroup {
    return 'kind' in node && node.kind === 'group';
  }

  private isKeyword(value: string): boolean {
    const token = this.peek();
    return token.type === 'KEYWORD' && token.value === value;
  }

  private isFunctionName(): boolean {
    const token = this.peek();
    return (
      token.type === 'IDENTIFIER' &&
      (token.value === 'contains' ||
        token.value === 'startswith' ||
        token.value === 'endswith')
    );
  }

  private expectKeywordValue(values: string[]): string {
    const token = this.consume();

    if (token.type !== 'KEYWORD' || !values.includes(token.value)) {
      throw new Error(
        `Expected one of "${values.join(', ')}" but found "${token.value}".`
      );
    }

    return token.value;
  }

  private expect(type: ODataTokenType): IODataToken {
    const token = this.consume();

    if (token.type !== type) {
      throw new Error(`Expected token "${type}" but found "${token.value}".`);
    }

    return token;
  }

  private consume(): IODataToken {
    const token = this.tokens[this.index];
    this.index += 1;
    return token;
  }

  private peek(): IODataToken {
    return this.tokens[this.index];
  }
}
