import type {
  IDenormalizedRuleNode,
  QueryGroupValue,
  QueryOperator,
} from '../../utils/query-tree';
import type { IParsedGroup, IToken, ParsedNode, TokenType } from './sql-token.types';
import { tokenizeSql } from './tokenize-sql';

export class SqlParser {
  private readonly tokens: IToken[];

  private index = 0;

  constructor(input: string) {
    this.tokens = tokenizeSql(input);
  }

  public parse(): ParsedNode[] {
    if (this.peek().type === 'EOF') {
      return [];
    }

    const expression = this.parseOr();
    this.expect('EOF');

    return [expression];
  }

  private parseOr(): ParsedNode {
    let left = this.parseAnd();

    while (this.isKeyword('OR')) {
      this.consume();
      const right = this.parseAnd();
      left = this.combine('OR', left, right);
    }

    return left;
  }

  private parseAnd(): ParsedNode {
    let left = this.parseNot();

    while (this.isKeyword('AND')) {
      this.consume();
      const right = this.parseNot();
      left = this.combine('AND', left, right);
    }

    return left;
  }

  private parseNot(): ParsedNode {
    if (this.isKeyword('NOT')) {
      this.consume();
      const operand = this.parsePrimary();

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

    return this.parsePrimary();
  }

  private parsePrimary(): ParsedNode {
    if (this.peek().type === 'LPAREN') {
      this.consume();
      const expression = this.parseOr();
      this.expect('RPAREN');

      if (this.isParsedGroup(expression)) {
        return expression;
      }

      return {
        kind: 'group',
        combinator: 'AND',
        isNegated: false,
        children: [expression],
      };
    }

    return this.parseComparison();
  }

  private parseComparison(): IDenormalizedRuleNode {
    const field = this.parseIdentifier();

    if (this.isKeyword('IS')) {
      this.consume();

      if (this.isKeyword('NOT')) {
        this.consume();
        this.expectKeyword('NULL');

        return { field, operator: 'IS_NOT_NULL' };
      }

      this.expectKeyword('NULL');
      return { field, operator: 'IS_NULL' };
    }

    if (this.isKeyword('NOT')) {
      this.consume();

      if (this.isKeyword('IN')) {
        this.consume();
        return { field, operator: 'NOT_IN', value: this.parseValueList() };
      }

      if (this.isKeyword('LIKE')) {
        this.consume();
        return this.createLikeRule(field, true, this.parseScalarValue());
      }

      if (this.isKeyword('BETWEEN')) {
        this.consume();
        const start = this.parseScalarValue();
        this.expectKeyword('AND');
        const end = this.parseScalarValue();

        return {
          field,
          operator: 'NOT_BETWEEN',
          value: this.createRangeValue(start, end),
        };
      }

      throw new Error(`Unexpected token "${this.peek().value}" after NOT.`);
    }

    if (this.isKeyword('IN')) {
      this.consume();
      return { field, operator: 'IN', value: this.parseValueList() };
    }

    if (this.isKeyword('LIKE')) {
      this.consume();
      return this.createLikeRule(field, false, this.parseScalarValue());
    }

    if (this.isKeyword('BETWEEN')) {
      this.consume();
      const start = this.parseScalarValue();
      this.expectKeyword('AND');
      const end = this.parseScalarValue();

      return {
        field,
        operator: 'BETWEEN',
        value: this.createRangeValue(start, end),
      };
    }

    const operatorToken = this.expect('OPERATOR');
    const value = this.parseScalarValue();

    return {
      field,
      operator: this.mapOperator(operatorToken.value),
      value,
    };
  }

  private createLikeRule(
    field: string,
    negated: boolean,
    value: string | number | boolean
  ): IDenormalizedRuleNode {
    if (typeof value !== 'string') {
      return {
        field,
        operator: negated ? 'NOT_LIKE' : 'LIKE',
        value,
      };
    }

    const startsWithWildcard = value.startsWith('%');
    const endsWithWildcard = value.endsWith('%');
    const normalizedValue = value.replace(/^%/, '').replace(/%$/, '');

    if (startsWithWildcard && endsWithWildcard) {
      return {
        field,
        operator: negated ? 'NOT_CONTAINS' : 'CONTAINS',
        value: normalizedValue,
      };
    }

    if (!startsWithWildcard && endsWithWildcard) {
      return {
        field,
        operator: 'STARTS_WITH',
        value: normalizedValue,
      };
    }

    if (startsWithWildcard && !endsWithWildcard) {
      return {
        field,
        operator: 'ENDS_WITH',
        value: normalizedValue,
      };
    }

    return {
      field,
      operator: negated ? 'NOT_LIKE' : 'LIKE',
      value,
    };
  }

  private parseValueList(): string[] | number[] {
    this.expect('LPAREN');
    const values: Array<string | number> = [];

    while (this.peek().type !== 'RPAREN') {
      const value = this.parseScalarValue();

      if (typeof value === 'boolean') {
        throw new Error('SQL IN lists currently support only string and number values.');
      }

      values.push(value);

      if (this.peek().type === 'COMMA') {
        this.consume();
      } else {
        break;
      }
    }

    this.expect('RPAREN');
    return this.normalizeArrayValue(values);
  }

  private createRangeValue(
    start: string | number | boolean,
    end: string | number | boolean
  ): string[] | number[] {
    if (typeof start === 'boolean' || typeof end === 'boolean') {
      throw new Error('SQL BETWEEN currently supports only string and number values.');
    }

    return this.normalizeArrayValue([start, end]);
  }

  private normalizeArrayValue(values: Array<string | number>): string[] | number[] {
    if (values.every(value => typeof value === 'string')) {
      return values as string[];
    }

    if (values.every(value => typeof value === 'number')) {
      return values as number[];
    }

    throw new Error('SQL arrays must contain values of the same scalar type.');
  }

  private parseScalarValue(): string | number | boolean {
    const token = this.consume();

    if (token.type === 'STRING') {
      return token.value;
    }

    if (token.type === 'NUMBER') {
      return Number(token.value);
    }

    if (token.type === 'KEYWORD' && token.value === 'TRUE') {
      return true;
    }

    if (token.type === 'KEYWORD' && token.value === 'FALSE') {
      return false;
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
        throw new Error(`Unsupported SQL operator "${value}".`);
    }
  }

  private combine(
    combinator: QueryGroupValue,
    left: ParsedNode,
    right: ParsedNode
  ): IParsedGroup {
    const children: ParsedNode[] = [];

    if (this.isParsedGroup(left) && !left.isNegated && left.combinator === combinator) {
      children.push(...left.children);
    } else {
      children.push(left);
    }

    if (
      this.isParsedGroup(right) &&
      !right.isNegated &&
      right.combinator === combinator
    ) {
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

  private isParsedGroup(node: ParsedNode): node is IParsedGroup {
    return 'kind' in node && node.kind === 'group';
  }

  private isKeyword(value: string): boolean {
    const token = this.peek();
    return token.type === 'KEYWORD' && token.value === value;
  }

  private expect(type: TokenType): IToken {
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

  private consume(): IToken {
    const token = this.tokens[this.index];
    this.index += 1;
    return token;
  }

  private peek(): IToken {
    return this.tokens[this.index];
  }
}
