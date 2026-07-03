import type {
  IDenormalizedRuleNode,
  QueryGroupValue,
  QueryOperator,
} from '../../utils/query-tree';
import { isFieldComparisonRule } from '../../utils/rule-value-source';
import type {
  IAqlToken,
  AqlTokenType,
  IParsedAqlGroup,
  ParsedAqlNode,
} from './aql-token.types';
import { stripAqlVariableName } from './extract-aql-predicate';
import { tokenizeAql } from './tokenize-aql';
import {
  AQL_DEFAULT_VARIABLE_NAME,
  extractAqlLikeOperator,
} from './shared';

type AqlFieldReference = { kind: 'field'; field: string };

export class AqlParser {
  private readonly tokens: IAqlToken[];
  private readonly variableName?: string;
  private index = 0;

  constructor(input: string) {
    const tokenized = tokenizeAql(input);
    this.tokens = tokenized.tokens;
    this.variableName = tokenized.variableName;
  }

  public parse(): ParsedAqlNode[] {
    if (this.peek().type === 'EOF') {
      return [];
    }

    const expression = this.parseOr();
    this.expect('EOF');
    return [expression];
  }

  private parseOr(): ParsedAqlNode {
    let left = this.parseAnd();

    while (this.isKeyword('OR')) {
      this.consume();
      left = this.combine('OR', left, this.parseAnd());
    }

    return left;
  }

  private parseAnd(): ParsedAqlNode {
    let left = this.parseNot();

    while (this.isKeyword('AND')) {
      this.consume();
      left = this.combine('AND', left, this.parseNot());
    }

    return left;
  }

  private parseNot(): ParsedAqlNode {
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

  private parsePrimary(): ParsedAqlNode {
    if (this.peek().type === 'LPAREN') {
      this.consume();
      const expression = this.parseOr();
      this.expect('RPAREN');
      return expression;
    }

    return this.parseComparison();
  }

  private parseComparison(): IDenormalizedRuleNode {
    const left = this.parseIdentifier();

    if (this.isKeyword('NOT')) {
      this.consume();

      if (this.isKeyword('IN')) {
        this.consume();
        return { field: left, operator: 'NOT_IN', value: this.parseArrayValue() };
      }

      if (this.isKeyword('LIKE')) {
        this.consume();
        return {
          field: left,
          ...extractAqlLikeOperator(this.parseStringValue(), true),
        };
      }
    }

    if (this.isKeyword('LIKE')) {
      this.consume();
      return {
        field: left,
        ...extractAqlLikeOperator(this.parseStringValue(), false),
      };
    }

    if (this.isKeyword('IN')) {
      this.consume();
      return { field: left, operator: 'IN', value: this.parseArrayValue() };
    }

    const operatorToken = this.expect('OPERATOR');
    const value = this.parseComparisonValue();

    return this.mapComparison(left, operatorToken.value, value);
  }

  private parseIdentifier(): string {
    const token = this.consume();

    if (token.type !== 'IDENTIFIER') {
      throw new Error(`Expected a field identifier but found "${token.value}".`);
    }

    if (this.variableName) {
      return stripAqlVariableName(token.value, this.variableName);
    }

    return stripAqlVariableName(token.value, AQL_DEFAULT_VARIABLE_NAME);
  }

  private parseScalarValue(): string | number | boolean | null {
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

    if (token.type === 'KEYWORD' && token.value === 'NULL') {
      return null;
    }

    throw new Error(`Expected a scalar value but found "${token.value}".`);
  }

  private parseComparisonValue():
    | string
    | number
    | boolean
    | null
    | AqlFieldReference {
    if (this.peek().type === 'IDENTIFIER') {
      return { kind: 'field', field: this.parseIdentifier() };
    }

    return this.parseScalarValue();
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
        throw new Error('AQL arrays currently support only string and number values.');
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

    throw new Error('AQL arrays must contain values of the same scalar type.');
  }

  private mapComparison(
    field: string,
    operator: string,
    value: string | number | boolean | null | AqlFieldReference
  ): IDenormalizedRuleNode {
    if (operator === '==' && value === null) {
      return { field, operator: 'IS_NULL' };
    }

    if (operator === '!=' && value === null) {
      return { field, operator: 'IS_NOT_NULL' };
    }

    if (this.isFieldReference(value)) {
      return {
        field,
        operator: this.mapOperator(operator),
        valueSource: 'field',
        valueField: value.field,
      };
    }

    return {
      field,
      operator: this.mapOperator(operator),
      value: value as Exclude<typeof value, null>,
    };
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
        throw new Error(`Unsupported AQL operator "${value}".`);
    }
  }

  private combine(
    combinator: QueryGroupValue,
    left: ParsedAqlNode,
    right: ParsedAqlNode
  ): ParsedAqlNode {
    const collapsedRange = this.tryCollapseRange(combinator, left, right);

    if (collapsedRange) {
      return collapsedRange;
    }

    const children: ParsedAqlNode[] = [];

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

  private isParsedGroup(node: ParsedAqlNode): node is IParsedAqlGroup {
    return 'kind' in node && node.kind === 'group';
  }

  private isRuleNode(node: ParsedAqlNode): node is IDenormalizedRuleNode {
    return !this.isParsedGroup(node);
  }

  private tryCollapseRange(
    combinator: QueryGroupValue,
    left: ParsedAqlNode,
    right: ParsedAqlNode
  ): IDenormalizedRuleNode | null {
    if (!this.isRuleNode(left) || !this.isRuleNode(right)) {
      return null;
    }

    if (left.field !== right.field) {
      return null;
    }

    if (isFieldComparisonRule(left) || isFieldComparisonRule(right)) {
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

  private isFieldReference(value: unknown): value is AqlFieldReference {
    return (
      typeof value === 'object' &&
      value !== null &&
      'kind' in value &&
      value.kind === 'field'
    );
  }

  private isKeyword(value: string): boolean {
    const token = this.peek();
    return token.type === 'KEYWORD' && token.value === value;
  }

  private expect(type: AqlTokenType): IAqlToken {
    const token = this.consume();

    if (token.type !== type) {
      throw new Error(`Expected token "${type}" but found "${token.value}".`);
    }

    return token;
  }

  private consume(): IAqlToken {
    const token = this.tokens[this.index];
    this.index += 1;
    return token;
  }

  private peek(): IAqlToken {
    return this.tokens[this.index];
  }
}
