import type {
  IDenormalizedRuleNode,
  QueryGroupValue,
  QueryOperator,
} from '../../utils/query-tree';
import { parseRsqlScalar, inferRsqlPatternOperator } from './shared';
import type {
  IParsedRsqlGroup,
  IRsqlToken,
  ParsedRsqlNode,
  RsqlTokenType,
} from './rsql-token.types';
import { tokenizeRsql } from './tokenize-rsql';

type ParsedScalar = string | number | boolean | null;

export class RsqlParser {
  private readonly tokens: IRsqlToken[];
  private index = 0;

  constructor(input: string) {
    this.tokens = tokenizeRsql(input);
  }

  public parse(): ParsedRsqlNode[] {
    if (this.peek().type === 'EOF') {
      return [];
    }

    const expression = this.parseOr();
    this.expect('EOF');
    return [expression];
  }

  private parseOr(): ParsedRsqlNode {
    let left = this.parseAnd();

    while (this.peek().type === 'COMMA') {
      this.consume();
      left = this.combine('OR', left, this.parseAnd());
    }

    return left;
  }

  private parseAnd(): ParsedRsqlNode {
    let left = this.parsePrimary();

    while (this.peek().type === 'SEMICOLON') {
      this.consume();
      left = this.combine('AND', left, this.parsePrimary());
    }

    return left;
  }

  private parsePrimary(): ParsedRsqlNode {
    if (this.peek().type === 'LPAREN') {
      this.consume();
      const expression = this.parseOr();
      this.expect('RPAREN');
      return expression;
    }

    return this.parseComparison();
  }

  private parseComparison(): IDenormalizedRuleNode {
    const field = this.parseSelector();
    const operator = this.expect('OPERATOR').value;

    if (operator === '=in=' || operator === '=out=') {
      const values = this.parseList();
      return {
        field,
        operator: operator === '=in=' ? 'IN' : 'NOT_IN',
        value: values as string[] | number[],
      };
    }

    const { value, quoted } = this.parseScalarToken();

    if (!quoted && value === null) {
      if (operator === '==') {
        return { field, operator: 'IS_NULL' };
      }

      if (operator === '!=') {
        return { field, operator: 'IS_NOT_NULL' };
      }
    }

    if (typeof value === 'string' && (value.includes('*') || quoted)) {
      if (operator === '==' || operator === '!=') {
        const inferred = inferRsqlPatternOperator(value, operator === '!=');

        if (inferred.operator !== 'EQUAL' || quoted) {
          return { field, ...inferred };
        }
      }
    }

    return {
      field,
      operator: this.mapOperator(operator),
      value: value as Exclude<ParsedScalar, null>,
    };
  }

  private parseList(): Array<string | number | boolean> {
    this.expect('LPAREN');
    const values: Array<string | number | boolean> = [];

    while (this.peek().type !== 'RPAREN') {
      const scalar = this.parseScalarToken().value;

      if (scalar === null) {
        throw new Error('RSQL "in" lists do not support null values.');
      }

      values.push(scalar as string | number | boolean);

      if (this.peek().type === 'COMMA') {
        this.consume();
      } else {
        break;
      }
    }

    this.expect('RPAREN');
    return values;
  }

  private parseSelector(): string {
    const token = this.consume();

    if (token.type !== 'VALUE') {
      throw new Error(`Expected a selector but found "${token.value}".`);
    }

    return token.value;
  }

  private parseScalarToken(): { value: ParsedScalar; quoted: boolean } {
    const token = this.consume();

    if (token.type === 'STRING') {
      return { value: token.value, quoted: true };
    }

    if (token.type === 'VALUE') {
      return { value: parseRsqlScalar(token.value), quoted: false };
    }

    throw new Error(`Expected a scalar value but found "${token.value}".`);
  }

  private mapOperator(value: string): QueryOperator {
    switch (value) {
      case '==':
        return 'EQUAL';
      case '!=':
        return 'NOT_EQUAL';
      case '=gt=':
        return 'LARGER';
      case '=ge=':
        return 'LARGER_EQUAL';
      case '=lt=':
        return 'SMALLER';
      case '=le=':
        return 'SMALLER_EQUAL';
      default:
        throw new Error(`Unsupported RSQL operator "${value}".`);
    }
  }

  private combine(
    combinator: QueryGroupValue,
    left: ParsedRsqlNode,
    right: ParsedRsqlNode
  ): ParsedRsqlNode {
    const collapsed = this.tryCollapse(combinator, left, right);

    if (collapsed) {
      return collapsed;
    }

    const children: ParsedRsqlNode[] = [];

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
    left: ParsedRsqlNode,
    right: ParsedRsqlNode
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
      combinator === 'OR' &&
      left.operator === 'EQUAL' &&
      right.operator === 'EQUAL'
    ) {
      return {
        field: left.field,
        operator: 'IN',
        value: [left.value, right.value] as string[] | number[],
      };
    }

    if (
      combinator === 'AND' &&
      left.operator === 'NOT_EQUAL' &&
      right.operator === 'NOT_EQUAL'
    ) {
      return {
        field: left.field,
        operator: 'NOT_IN',
        value: [left.value, right.value] as string[] | number[],
      };
    }

    if (
      combinator === 'AND' &&
      left.operator === 'EQUAL' &&
      right.operator === 'EQUAL'
    ) {
      return {
        field: left.field,
        operator: 'ALL_IN',
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

  private isRuleNode(node: ParsedRsqlNode): node is IDenormalizedRuleNode {
    return !this.isParsedGroup(node);
  }

  private isParsedGroup(node: ParsedRsqlNode): node is IParsedRsqlGroup {
    return 'kind' in node && node.kind === 'group';
  }

  private expect(type: RsqlTokenType): IRsqlToken {
    const token = this.consume();

    if (token.type !== type) {
      throw new Error(`Expected token "${type}" but found "${token.value}".`);
    }

    return token;
  }

  private consume(): IRsqlToken {
    const token = this.tokens[this.index];
    this.index += 1;
    return token;
  }

  private peek(): IRsqlToken {
    return this.tokens[this.index];
  }
}
