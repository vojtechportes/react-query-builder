import type {
  IDenormalizedRuleNode,
  QueryGroupValue,
  QueryOperator,
} from '../../utils/query-tree';
import type {
  CelTokenType,
  ICelToken,
  IParsedCelGroup,
  ParsedCelNode,
} from './cel-token.types';
import { inferCelMatchesOperator } from './shared';
import { tokenizeCel } from './tokenize-cel';

const CEL_STRING_METHODS = new Set([
  'contains',
  'startsWith',
  'endsWith',
  'matches',
]);

const CEL_LIST_METHODS = new Set(['all', 'exists']);

export class CelParser {
  private readonly tokens: ICelToken[];
  private index = 0;

  constructor(input: string) {
    this.tokens = tokenizeCel(input);
  }

  public parse(): ParsedCelNode[] {
    if (this.peek().type === 'EOF') {
      return [];
    }

    const expression = this.parseOr();
    this.expect('EOF');
    return [expression];
  }

  private parseOr(): ParsedCelNode {
    let left = this.parseAnd();

    while (this.isOperator('||')) {
      this.consume();
      left = this.combine('OR', left, this.parseAnd());
    }

    return left;
  }

  private parseAnd(): ParsedCelNode {
    let left = this.parseNot();

    while (this.isOperator('&&')) {
      this.consume();
      left = this.combine('AND', left, this.parseNot());
    }

    return left;
  }

  private parseNot(): ParsedCelNode {
    if (!this.isOperator('!')) {
      return this.parsePrimary();
    }

    this.consume();
    const operand = this.parsePrimary();

    if (this.isRuleNode(operand)) {
      if (operand.operator === 'IN') {
        return { ...operand, operator: 'NOT_IN' };
      }

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

  private parsePrimary(): ParsedCelNode {
    if (this.peek().type === 'LPAREN') {
      this.consume();
      const expression = this.parseOr();
      this.expect('RPAREN');
      return expression;
    }

    if (this.peek().type === 'LBRACKET') {
      return this.parseArrayMacro();
    }

    return this.parseComparisonOrMethod();
  }

  private parseArrayMacro(): IDenormalizedRuleNode {
    const values = this.parseArrayValue();
    this.expect('DOT');
    const methodName = this.expect('IDENTIFIER').value;

    if (!CEL_LIST_METHODS.has(methodName)) {
      throw new Error(`Unsupported CEL list method "${methodName}".`);
    }

    this.expect('LPAREN');
    const iteratorName = this.expect('IDENTIFIER').value;
    this.expect('COMMA');
    const iteratorRule = this.parseIteratorMembership(iteratorName);
    this.expect('RPAREN');

    return {
      field: iteratorRule.field,
      operator: methodName === 'all' ? 'ALL_IN' : 'ANY_IN',
      value: values,
    };
  }

  private parseIteratorMembership(iteratorName: string): IDenormalizedRuleNode {
    const left = this.parseFieldPath(false);
    this.expectKeyword('in');
    const right = this.parseFieldPath(true);

    if (left !== iteratorName) {
      throw new Error(
        `CEL iterator predicate must reference iterator "${iteratorName}".`
      );
    }

    return {
      field: right,
      operator: 'ALL_IN',
      value: [] as string[] | number[],
    };
  }

  private parseComparisonOrMethod(): IDenormalizedRuleNode {
    const field = this.parseFieldPath(true);

    if (this.peek().type === 'DOT') {
      return this.parseMethodCall(field);
    }

    if (this.isKeyword('in')) {
      this.consume();
      return {
        field,
        operator: 'IN',
        value: this.parseArrayValue(),
      };
    }

    const operatorToken = this.expect('OPERATOR');
    const value = this.parseScalarValue();

    if (operatorToken.value === '==' && value === null) {
      return { field, operator: 'IS_NULL' };
    }

    if (operatorToken.value === '!=' && value === null) {
      return { field, operator: 'IS_NOT_NULL' };
    }

    return {
      field,
      operator: this.mapOperator(operatorToken.value),
      value: value as Exclude<typeof value, null>,
    };
  }

  private parseMethodCall(field: string): IDenormalizedRuleNode {
    this.expect('DOT');
    const methodName = this.expect('IDENTIFIER').value;

    if (!CEL_STRING_METHODS.has(methodName)) {
      throw new Error(`Unsupported CEL method "${methodName}".`);
    }

    this.expect('LPAREN');
    const value = this.parseStringValue();
    this.expect('RPAREN');

    if (methodName === 'contains') {
      return { field, operator: 'CONTAINS', value };
    }

    if (methodName === 'startsWith') {
      return { field, operator: 'STARTS_WITH', value };
    }

    if (methodName === 'endsWith') {
      return { field, operator: 'ENDS_WITH', value };
    }

    return {
      field,
      ...inferCelMatchesOperator(value),
    };
  }

  private parseFieldPath(stopBeforeMethod: boolean): string {
    const start = this.expect('IDENTIFIER').value;
    let path = start;

    while (this.peek().type === 'DOT') {
      const next = this.peekAt(1);
      const afterNext = this.peekAt(2);

      if (
        stopBeforeMethod &&
        next?.type === 'IDENTIFIER' &&
        afterNext?.type === 'LPAREN' &&
        CEL_STRING_METHODS.has(next.value)
      ) {
        break;
      }

      this.consume();

      const segment = this.expect('IDENTIFIER').value;
      path += `.${segment}`;
    }

    return path;
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

  private parseArrayValue(): string[] | number[] {
    this.expect('LBRACKET');
    const values: Array<string | number> = [];

    while (this.peek().type !== 'RBRACKET') {
      const value = this.parseScalarValue();

      if (typeof value === 'boolean' || value === null) {
        throw new Error('CEL arrays currently support only string and number values.');
      }

      values.push(value);

      if (this.peek().type === 'COMMA') {
        this.consume();
      } else {
        break;
      }
    }

    this.expect('RBRACKET');

    if (values.every(value => typeof value === 'string')) {
      return values as string[];
    }

    if (values.every(value => typeof value === 'number')) {
      return values as number[];
    }

    throw new Error('CEL arrays must contain values of the same scalar type.');
  }

  private mapOperator(value: string): QueryOperator {
    switch (value) {
      case '==':
        return 'EQUAL';
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
        throw new Error(`Unsupported CEL operator "${value}".`);
    }
  }

  private combine(
    combinator: QueryGroupValue,
    left: ParsedCelNode,
    right: ParsedCelNode
  ): ParsedCelNode {
    const collapsed = this.tryCollapse(combinator, left, right);

    if (collapsed) {
      return collapsed;
    }

    const children: ParsedCelNode[] = [];

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
    left: ParsedCelNode,
    right: ParsedCelNode
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

    return null;
  }

  private isRuleNode(node: ParsedCelNode): node is IDenormalizedRuleNode {
    return !this.isParsedGroup(node);
  }

  private isParsedGroup(node: ParsedCelNode): node is IParsedCelGroup {
    return 'kind' in node && node.kind === 'group';
  }

  private isKeyword(value: string): boolean {
    const token = this.peek();
    return token.type === 'KEYWORD' && token.value === value;
  }

  private expectKeyword(value: string): void {
    const token = this.consume();

    if (token.type !== 'KEYWORD' || token.value !== value) {
      throw new Error(`Expected keyword "${value}" but found "${token.value}".`);
    }
  }

  private isOperator(value: string): boolean {
    const token = this.peek();
    return token.type === 'OPERATOR' && token.value === value;
  }

  private expect(type: CelTokenType): ICelToken {
    const token = this.consume();

    if (token.type !== type) {
      throw new Error(`Expected token "${type}" but found "${token.value}".`);
    }

    return token;
  }

  private consume(): ICelToken {
    const token = this.tokens[this.index];
    this.index += 1;
    return token;
  }

  private peek(): ICelToken {
    return this.tokens[this.index];
  }

  private peekAt(offset: number): ICelToken | undefined {
    return this.tokens[this.index + offset];
  }
}
