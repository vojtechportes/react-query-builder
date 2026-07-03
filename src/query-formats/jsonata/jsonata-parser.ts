import type {
  IDenormalizedRuleNode,
  QueryGroupValue,
  QueryOperator,
} from '../../utils/query-tree';
import { isFieldComparisonRule } from '../../utils/rule-value-source';
import type {
  IJsonataToken,
  JsonataTokenType,
  IParsedJsonataGroup,
  ParsedJsonataNode,
} from './jsonata-token.types';
import { inferJsonataContainsOperator } from './shared';
import { tokenizeJsonata } from './tokenize-jsonata';

export class JsonataParser {
  private readonly tokens: IJsonataToken[];
  private index = 0;

  constructor(input: string) {
    this.tokens = tokenizeJsonata(input);
  }

  public parse(): ParsedJsonataNode[] {
    if (this.peek().type === 'EOF') {
      return [];
    }

    const expression = this.parseOr();
    this.expect('EOF');
    return [expression];
  }

  private parseOr(): ParsedJsonataNode {
    let left = this.parseAnd();
    while (this.isKeyword('or')) {
      this.consume();
      left = this.combine('OR', left, this.parseAnd());
    }
    return left;
  }

  private parseAnd(): ParsedJsonataNode {
    let left = this.parsePrimary();
    while (this.isKeyword('and')) {
      this.consume();
      left = this.combine('AND', left, this.parsePrimary());
    }
    return left;
  }

  private parsePrimary(): ParsedJsonataNode {
    if (this.peek().type === 'LPAREN') {
      this.consume();
      const expression = this.parseOr();
      this.expect('RPAREN');
      return expression;
    }

    if (this.peek().type === 'FUNCTION') {
      return this.parseFunctionExpression();
    }

    return this.parseComparison();
  }

  private parseFunctionExpression(): ParsedJsonataNode {
    const token = this.consume();

    if (token.value === '$not') {
      this.expect('LPAREN');
      const inner = this.parsePrimary();
      this.expect('RPAREN');

      if (this.isRuleNode(inner)) {
        if (inner.operator === 'IN') {
          return { ...inner, operator: 'NOT_IN' };
        }
        if (inner.operator === 'CONTAINS') {
          return { ...inner, operator: 'NOT_CONTAINS' };
        }
        if (inner.operator === 'LIKE') {
          return { ...inner, operator: 'NOT_LIKE' };
        }
      }

      if (this.isParsedGroup(inner)) {
        return { ...inner, isNegated: !inner.isNegated };
      }

      return {
        kind: 'group',
        combinator: 'AND',
        isNegated: true,
        children: [inner],
      };
    }

    if (token.value === '$contains') {
      this.expect('LPAREN');
      const field = this.parseIdentifier();
      this.expect('COMMA');
      const pattern = this.consume();
      this.expect('RPAREN');

      if (pattern.type === 'STRING') {
        return { field, operator: 'CONTAINS', value: pattern.value };
      }

      if (pattern.type === 'REGEX') {
        return {
          field,
          ...inferJsonataContainsOperator(pattern.value),
        };
      }
    }

    throw new Error(`Unsupported JSONata function "${token.value}".`);
  }

  private parseComparison(): ParsedJsonataNode {
    if (this.peek().type === 'STRING' || this.peek().type === 'NUMBER') {
      const value = this.parseScalarValue();
      this.expectKeyword('in');
      const field = this.parseIdentifier();

      return {
        field,
        operator: 'ALL_IN',
        value: [value] as string[] | number[],
      };
    }

    const field = this.parseIdentifier();

    if (this.isKeyword('in')) {
      this.consume();
      return { field, operator: 'IN', value: this.parseArrayValue() };
    }

    const operatorToken = this.expect('OPERATOR');
    const nextToken = this.peek();
    const valueField = nextToken.type === 'IDENTIFIER' ? this.parseIdentifier() : undefined;
    const value = valueField ? undefined : this.parseScalarValue();

    if (operatorToken.value === '=' && value === null) {
      return { field, operator: 'IS_NULL' };
    }

    if (operatorToken.value === '!=' && value === null) {
      return { field, operator: 'IS_NOT_NULL' };
    }

    return valueField
      ? {
          field,
          operator: this.mapOperator(operatorToken.value),
          valueSource: 'field',
          valueField,
        }
      : {
          field,
          operator: this.mapOperator(operatorToken.value),
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
    if (token.type === 'STRING') return token.value;
    if (token.type === 'NUMBER') return Number(token.value);
    if (token.type === 'KEYWORD' && token.value === 'true') return true;
    if (token.type === 'KEYWORD' && token.value === 'false') return false;
    if (token.type === 'KEYWORD' && token.value === 'null') return null;
    throw new Error(`Expected a scalar value but found "${token.value}".`);
  }

  private parseArrayValue(): string[] | number[] {
    this.expect('LBRACKET');
    const values: Array<string | number> = [];
    while (this.peek().type !== 'RBRACKET') {
      const value = this.parseScalarValue();
      if (typeof value === 'boolean' || value === null) {
        throw new Error('JSONata arrays currently support only string and number values.');
      }
      values.push(value);
      if (this.peek().type === 'COMMA') this.consume();
      else break;
    }
    this.expect('RBRACKET');
    if (values.every(v => typeof v === 'string')) return values as string[];
    if (values.every(v => typeof v === 'number')) return values as number[];
    throw new Error('JSONata arrays must contain values of the same scalar type.');
  }

  private mapOperator(value: string): QueryOperator {
    switch (value) {
      case '=':
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
        throw new Error(`Unsupported JSONata operator "${value}".`);
    }
  }

  private combine(
    combinator: QueryGroupValue,
    left: ParsedJsonataNode,
    right: ParsedJsonataNode
  ): ParsedJsonataNode {
    const collapsed = this.tryCollapse(combinator, left, right);
    if (collapsed) {
      return collapsed;
    }

    const children: ParsedJsonataNode[] = [];
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
    return { kind: 'group', combinator, isNegated: false, children };
  }

  private tryCollapse(
    combinator: QueryGroupValue,
    left: ParsedJsonataNode,
    right: ParsedJsonataNode
  ): IDenormalizedRuleNode | null {
    if (
      this.isRuleNode(left) &&
      this.isRuleNode(right) &&
      left.field === right.field &&
      !isFieldComparisonRule(left) &&
      !isFieldComparisonRule(right)
    ) {
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
        left.operator === 'ALL_IN' &&
        right.operator === 'ALL_IN' &&
        Array.isArray(left.value) &&
        Array.isArray(right.value)
      ) {
        return {
          field: left.field,
          operator: combinator === 'AND' ? 'ALL_IN' : 'ANY_IN',
          value: [...left.value, ...right.value] as string[] | number[],
        };
      }
    }

    return null;
  }

  private isRuleNode(node: ParsedJsonataNode): node is IDenormalizedRuleNode {
    return !this.isParsedGroup(node);
  }

  private isParsedGroup(node: ParsedJsonataNode): node is IParsedJsonataGroup {
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

  private expect(type: JsonataTokenType): IJsonataToken {
    const token = this.consume();
    if (token.type !== type) {
      throw new Error(`Expected token "${type}" but found "${token.value}".`);
    }
    return token;
  }

  private consume(): IJsonataToken {
    const token = this.tokens[this.index];
    this.index += 1;
    return token;
  }

  private peek(): IJsonataToken {
    return this.tokens[this.index];
  }
}
