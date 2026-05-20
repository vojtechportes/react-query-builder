import type {
  IDenormalizedRuleNode,
  QueryGroupValue,
  QueryOperator,
} from '../../utils/query-tree';
import type {
  IDynamoToken,
  DynamoTokenType,
  IParsedDynamoGroup,
  ParsedDynamoNode,
} from './dynamo-token.types';
import { inferDynamoStringOperator } from './shared';
import { tokenizeDynamo } from './tokenize-dynamo';

export class DynamoParser {
  private readonly tokens: IDynamoToken[];
  private index = 0;

  constructor(input: string) {
    this.tokens = tokenizeDynamo(input);
  }

  public parse(): ParsedDynamoNode[] {
    if (this.peek().type === 'EOF') {
      return [];
    }

    const expression = this.parseOr();
    this.expect('EOF');
    return [expression];
  }

  private parseOr(): ParsedDynamoNode {
    let left = this.parseAnd();

    while (this.isKeyword('OR')) {
      this.consume();
      left = this.combine('OR', left, this.parseAnd());
    }

    return left;
  }

  private parseAnd(): ParsedDynamoNode {
    let left = this.parseNot();

    while (this.isKeyword('AND')) {
      this.consume();
      left = this.combine('AND', left, this.parseNot());
    }

    return left;
  }

  private parseNot(): ParsedDynamoNode {
    if (!this.isKeyword('NOT')) {
      return this.parsePrimary();
    }

    this.consume();
    const operand = this.parsePrimary();

    if (this.isRuleNode(operand)) {
      if (operand.operator === 'CONTAINS') {
        return { ...operand, operator: 'NOT_CONTAINS' };
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

  private parsePrimary(): ParsedDynamoNode {
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

  private parseFunctionExpression(): IDenormalizedRuleNode {
    const functionName = this.expect('KEYWORD').value;
    this.expect('LPAREN');
    const field = this.parseIdentifier();

    if (functionName === 'attribute_exists') {
      this.expect('RPAREN');
      return { field, operator: 'IS_NOT_NULL' };
    }

    if (functionName === 'attribute_not_exists') {
      this.expect('RPAREN');
      return { field, operator: 'IS_NULL' };
    }

    this.expect('COMMA');
    const value = this.parseScalarValue();
    this.expect('RPAREN');

    if (typeof value !== 'string') {
      throw new Error(`Function "${functionName}" requires a string value.`);
    }

    return {
      field,
      operator: inferDynamoStringOperator(functionName),
      value,
    };
  }

  private parseComparison(): IDenormalizedRuleNode {
    const field = this.parseIdentifier();

    if (this.isKeyword('IN')) {
      this.consume();
      return { field, operator: 'IN', value: this.parseValueList() };
    }

    if (this.isKeyword('BETWEEN')) {
      this.consume();
      const start = this.parseScalarValue();
      this.expectKeyword('AND');
      const end = this.parseScalarValue();

      if (typeof start === 'boolean' || typeof end === 'boolean' || start === null || end === null) {
        throw new Error('Dynamo BETWEEN supports only string and number values.');
      }

      return {
        field,
        operator: 'BETWEEN',
        value: [start, end] as string[] | number[],
      };
    }

    const operator = this.expect('OPERATOR').value;
    const value = this.parseScalarValue();

    if (operator === '=' && value === null) {
      return { field, operator: 'IS_NULL' };
    }

    if ((operator === '<>' || operator === '!=') && value === null) {
      return { field, operator: 'IS_NOT_NULL' };
    }

    return {
      field,
      operator: this.mapOperator(operator),
      value: value as Exclude<typeof value, null>,
    };
  }

  private parseValueList(): string[] | number[] {
    this.expect('LPAREN');
    const values: Array<string | number> = [];

    while (this.peek().type !== 'RPAREN') {
      const value = this.parseScalarValue();

      if (typeof value === 'boolean' || value === null) {
        throw new Error('Dynamo IN lists currently support only string and number values.');
      }

      values.push(value);

      if (this.peek().type === 'COMMA') {
        this.consume();
      } else {
        break;
      }
    }

    this.expect('RPAREN');

    if (values.every(value => typeof value === 'string')) {
      return values as string[];
    }

    if (values.every(value => typeof value === 'number')) {
      return values as number[];
    }

    throw new Error('Dynamo arrays must contain values of the same scalar type.');
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

  private parseIdentifier(): string {
    const token = this.consume();

    if (token.type !== 'IDENTIFIER') {
      throw new Error(`Expected a field identifier but found "${token.value}".`);
    }

    return token.value;
  }

  private mapOperator(value: string): QueryOperator {
    switch (value) {
      case '=':
        return 'EQUAL';
      case '<>':
      case '!=':
        return 'NOT_EQUAL';
      case '>':
        return 'LARGER';
      case '>=':
        return 'LARGER_EQUAL';
      case '<':
        return 'SMALLER';
      case '<=':
        return 'SMALLER_EQUAL';
      default:
        throw new Error(`Unsupported Dynamo operator "${value}".`);
    }
  }

  private combine(
    combinator: QueryGroupValue,
    left: ParsedDynamoNode,
    right: ParsedDynamoNode
  ): ParsedDynamoNode {
    const collapsed = this.tryCollapse(combinator, left, right);

    if (collapsed) {
      return collapsed;
    }

    const children: ParsedDynamoNode[] = [];

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
    left: ParsedDynamoNode,
    right: ParsedDynamoNode
  ): IDenormalizedRuleNode | null {
    if (!this.isRuleNode(left) || !this.isRuleNode(right) || left.field !== right.field) {
      return null;
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

    return null;
  }

  private isRuleNode(node: ParsedDynamoNode): node is IDenormalizedRuleNode {
    return !this.isParsedGroup(node);
  }

  private isParsedGroup(node: ParsedDynamoNode): node is IParsedDynamoGroup {
    return 'kind' in node && node.kind === 'group';
  }

  private isKeyword(value: string): boolean {
    const token = this.peek();
    return token.type === 'KEYWORD' && token.value === value;
  }

  private isFunctionName(): boolean {
    const token = this.peek();
    return (
      token.type === 'KEYWORD' &&
      (token.value === 'attribute_exists' ||
        token.value === 'attribute_not_exists' ||
        token.value === 'contains' ||
        token.value === 'begins_with')
    );
  }

  private expect(type: DynamoTokenType): IDynamoToken {
    const token = this.consume();

    if (token.type !== type) {
      throw new Error(`Expected token "${type}" but found "${token.value}".`);
    }

    return token;
  }

  private expectKeyword(value: string): void {
    const token = this.consume();

    if (token.type !== 'KEYWORD' || token.value !== value) {
      throw new Error(`Expected keyword "${value}" but found "${token.value}".`);
    }
  }

  private consume(): IDynamoToken {
    const token = this.tokens[this.index];
    this.index += 1;
    return token;
  }

  private peek(): IDynamoToken {
    return this.tokens[this.index];
  }
}
