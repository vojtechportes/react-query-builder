import { IStrings } from '../../constants/strings';
import type { QueryGroupValue, QueryOperator } from '../../utils/query-tree';
import type { IParsedGroup, IToken, ParsedNode, TokenType } from './sql-token.types';
import { tokenizeSql } from './tokenize-sql';
import { IParsedSqlArrayValue } from './types/parsed-sql-array-value';
import { IParsedSqlRuleNode } from './types/parsed-sql-rule-node';
import { IParsedSqlScalarValue } from './types/parsed-sql-scalar-value';
import { getMissingSqlKeywordMessage } from './utils/get-missing-sql-keyword-message';
import { getMissingSqlTokenMessage } from './utils/get-missing-sql-token-message';
import { createSqlParseError } from './utils/create-sql-parse-error';
import { getSqlParserString } from './utils/get-sql-parser-string';

export class SqlParser {
  private readonly tokens: IToken[];
  private readonly textModeStrings?: IStrings['textMode'];

  private index = 0;

  constructor(input: string, textModeStrings?: IStrings['textMode']) {
    this.textModeStrings = textModeStrings;
    this.tokens = tokenizeSql(input, textModeStrings);
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
      const notToken = this.consume();
      const operand = this.parseNot();
      const nextNegationSources = [
        this.toTokenRange(notToken),
        ...(this.isParsedGroup(operand) ? operand.negationSources || [] : []),
      ];

      if (this.isParsedGroup(operand)) {
        return {
          ...operand,
          isNegated: !operand.isNegated,
          negationSources: nextNegationSources,
        };
      }

      return {
        kind: 'group',
        combinator: 'AND',
        isNegated: true,
        children: [operand],
        negationSources: nextNegationSources,
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
        return {
          ...expression,
          preserveBoundary: true,
        };
      }

      return {
        kind: 'group',
        combinator: 'AND',
        isNegated: false,
        children: [expression],
        preserveBoundary: true,
      };
    }

    return this.parseComparison();
  }

  private parseComparison(): IParsedSqlRuleNode {
    const fieldToken = this.parseIdentifier();
    const field = fieldToken.value;

    if (this.isKeyword('IS')) {
      const isToken = this.expectKeyword('IS');

      if (this.isKeyword('NOT')) {
        const notToken = this.expectKeyword('NOT');
        const nullToken = this.expectKeyword('NULL');

        return {
          field,
          operator: 'IS_NOT_NULL',
          source: {
            field: this.toTokenRange(fieldToken),
            operator: {
              start: isToken.start,
              end: nullToken.end,
            },
            value: this.toTokenRange(notToken),
          },
        };
      }

      const nullToken = this.expectKeyword('NULL');
      return {
        field,
        operator: 'IS_NULL',
        source: {
          field: this.toTokenRange(fieldToken),
          operator: {
            start: isToken.start,
            end: nullToken.end,
          },
        },
      };
    }

    if (this.isKeyword('NOT')) {
      const notToken = this.expectKeyword('NOT');

      if (this.isKeyword('IN')) {
        const inToken = this.expectKeyword('IN');
        const values = this.parseValueList();
        return {
          field,
          operator: 'NOT_IN',
          value: values.value,
          source: {
            field: this.toTokenRange(fieldToken),
            operator: {
              start: notToken.start,
              end: inToken.end,
            },
            value: values.range,
            values: values.values,
          },
        };
      }

      if (this.isKeyword('LIKE')) {
        const likeToken = this.expectKeyword('LIKE');
        return this.createLikeRule(fieldToken, true, likeToken, this.parseScalarValue());
      }

      if (this.isKeyword('BETWEEN')) {
        const betweenToken = this.expectKeyword('BETWEEN');
        const start = this.parseScalarValue();
        this.expectKeyword('AND');
        const end = this.parseScalarValue();
        const value = this.createRangeValue(start, end);

        return {
          field,
          operator: 'NOT_BETWEEN',
          value: value.value,
          source: {
            field: this.toTokenRange(fieldToken),
            operator: {
              start: notToken.start,
              end: betweenToken.end,
            },
            value: value.range,
            values: value.values,
          },
        };
      }

      const token = this.peek();
      throw createSqlParseError(
        'unexpected_token',
        getSqlParserString(
          this.textModeStrings,
          'unexpectedTokenAfterNot',
          `Unexpected token "${token.value}" after NOT.`,
          { value: token.value }
        ),
        token.start,
        token.end
      );
    }

    if (this.isKeyword('IN')) {
      const inToken = this.expectKeyword('IN');
      const values = this.parseValueList();
      return {
        field,
        operator: 'IN',
        value: values.value,
        source: {
          field: this.toTokenRange(fieldToken),
          operator: this.toTokenRange(inToken),
          value: values.range,
          values: values.values,
        },
      };
    }

    if (this.isKeyword('LIKE')) {
      const likeToken = this.expectKeyword('LIKE');
      return this.createLikeRule(fieldToken, false, likeToken, this.parseScalarValue());
    }

    if (this.isKeyword('BETWEEN')) {
      const betweenToken = this.expectKeyword('BETWEEN');
      const start = this.parseScalarValue();
      this.expectKeyword('AND');
      const end = this.parseScalarValue();
      const value = this.createRangeValue(start, end);

      return {
        field,
        operator: 'BETWEEN',
        value: value.value,
        source: {
          field: this.toTokenRange(fieldToken),
          operator: this.toTokenRange(betweenToken),
          value: value.range,
          values: value.values,
        },
      };
    }

    const operatorToken = this.expect('OPERATOR');
    const value = this.parseScalarValue();

    return {
      field,
      operator: this.mapOperator(operatorToken.value),
      value: value.value,
      source: {
        field: this.toTokenRange(fieldToken),
        operator: this.toTokenRange(operatorToken),
        value: value.range,
        values: [value.range],
      },
    };
  }

  private createLikeRule(
    fieldToken: IToken,
    negated: boolean,
    operatorToken: IToken,
    value: IParsedSqlScalarValue
  ): IParsedSqlRuleNode {
    const field = fieldToken.value;

    if (typeof value.value !== 'string') {
      return {
        field,
        operator: negated ? 'NOT_LIKE' : 'LIKE',
        value: value.value,
        source: {
          field: this.toTokenRange(fieldToken),
          operator: this.toTokenRange(operatorToken),
          value: value.range,
          values: [value.range],
        },
      };
    }

    const startsWithWildcard = value.value.startsWith('%');
    const endsWithWildcard = value.value.endsWith('%');
    const normalizedValue = value.value.replace(/^%/, '').replace(/%$/, '');

    if (startsWithWildcard && endsWithWildcard) {
      return {
        field,
        operator: negated ? 'NOT_CONTAINS' : 'CONTAINS',
        value: normalizedValue,
        source: {
          field: this.toTokenRange(fieldToken),
          operator: this.toTokenRange(operatorToken),
          value: value.range,
          values: [value.range],
        },
      };
    }

    if (!startsWithWildcard && endsWithWildcard) {
      return {
        field,
        operator: 'STARTS_WITH',
        value: normalizedValue,
        source: {
          field: this.toTokenRange(fieldToken),
          operator: this.toTokenRange(operatorToken),
          value: value.range,
          values: [value.range],
        },
      };
    }

    if (startsWithWildcard && !endsWithWildcard) {
      return {
        field,
        operator: 'ENDS_WITH',
        value: normalizedValue,
        source: {
          field: this.toTokenRange(fieldToken),
          operator: this.toTokenRange(operatorToken),
          value: value.range,
          values: [value.range],
        },
      };
    }

    return {
      field,
      operator: negated ? 'NOT_LIKE' : 'LIKE',
      value: value.value,
      source: {
        field: this.toTokenRange(fieldToken),
        operator: this.toTokenRange(operatorToken),
        value: value.range,
        values: [value.range],
      },
    };
  }

  private parseValueList(): IParsedSqlArrayValue {
    const startToken = this.expect('LPAREN');
    const values: Array<string | number> = [];
    const valueRanges = [];

    while (this.peek().type !== 'RPAREN') {
      const value = this.parseScalarValue();

      if (typeof value.value === 'boolean') {
        throw createSqlParseError(
          'invalid_in_value',
          getSqlParserString(
            this.textModeStrings,
            'sqlInListsSupportOnlyStringAndNumberValues',
            'SQL IN lists currently support only string and number values.'
          ),
          value.range.start,
          value.range.end
        );
      }

      values.push(value.value);
      valueRanges.push(value.range);

      if (this.peek().type === 'COMMA') {
        this.consume();
      } else {
        break;
      }
    }

    const endToken = this.expect('RPAREN');
    return {
      value: this.normalizeArrayValue(values),
      range: {
        start: startToken.start,
        end: endToken.end,
      },
      values: valueRanges,
    };
  }

  private createRangeValue(
    start: IParsedSqlScalarValue,
    end: IParsedSqlScalarValue
  ): IParsedSqlArrayValue {
    if (typeof start.value === 'boolean' || typeof end.value === 'boolean') {
      throw createSqlParseError(
        'invalid_between_value',
        getSqlParserString(
          this.textModeStrings,
          'sqlBetweenSupportsOnlyStringAndNumberValues',
          'SQL BETWEEN currently supports only string and number values.'
        ),
        start.range.start,
        end.range.end
      );
    }

    return {
      value: this.normalizeArrayValue([start.value, end.value]),
      range: {
        start: start.range.start,
        end: end.range.end,
      },
      values: [start.range, end.range],
    };
  }

  private normalizeArrayValue(values: Array<string | number>): string[] | number[] {
    if (values.every(value => typeof value === 'string')) {
      return values as string[];
    }

    if (values.every(value => typeof value === 'number')) {
      return values as number[];
    }

    const token = this.peek();
    throw createSqlParseError(
      'mixed_array_types',
      getSqlParserString(
        this.textModeStrings,
        'sqlArraysMustContainSameScalarType',
        'SQL arrays must contain values of the same scalar type.'
      ),
      token.start,
      token.end
    );
  }

  private parseScalarValue(): IParsedSqlScalarValue {
    const token = this.consume();

    if (token.type === 'STRING') {
      return {
        value: token.value,
        range: this.toTokenRange(token),
      };
    }

    if (token.type === 'NUMBER') {
      return {
        value: Number(token.value),
        range: this.toTokenRange(token),
      };
    }

    if (token.type === 'KEYWORD' && token.value === 'TRUE') {
      return {
        value: true,
        range: this.toTokenRange(token),
      };
    }

    if (token.type === 'KEYWORD' && token.value === 'FALSE') {
      return {
        value: false,
        range: this.toTokenRange(token),
      };
    }

    throw createSqlParseError(
      'expected_scalar',
      getSqlParserString(
        this.textModeStrings,
        'expectedScalarValue',
        `Expected a scalar value but found "${token.value}".`,
        { value: token.value }
      ),
      token.start,
      token.end
    );
  }

  private parseIdentifier(): IToken {
    const token = this.consume();

    if (token.type !== 'IDENTIFIER') {
      throw createSqlParseError(
        'expected_identifier',
        getSqlParserString(
          this.textModeStrings,
          'expectedFieldIdentifier',
          `Expected a field identifier but found "${token.value}".`,
          { value: token.value }
        ),
        token.start,
        token.end
      );
    }

    return token;
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
      default: {
        const token = this.peek();
        throw createSqlParseError(
          'unsupported_operator',
          getSqlParserString(
            this.textModeStrings,
            'unsupportedSqlOperator',
            `Unsupported SQL operator "${value}".`,
            { operator: value }
          ),
          token.start,
          token.end
        );
      }
    }
  }

  private combine(
    combinator: QueryGroupValue,
    left: ParsedNode,
    right: ParsedNode
  ): IParsedGroup {
    const children: ParsedNode[] = [];

    if (
      this.isParsedGroup(left) &&
      !left.isNegated &&
      !left.preserveBoundary &&
      left.combinator === combinator
    ) {
      children.push(...left.children);
    } else {
      children.push(left);
    }

    if (
      this.isParsedGroup(right) &&
      !right.isNegated &&
      !right.preserveBoundary &&
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
      negationSources: undefined,
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
      if (token.type === 'EOF') {
        throw createSqlParseError(
          'missing_token',
          getMissingSqlTokenMessage(type, this.textModeStrings),
          token.start,
          token.end
        );
      }

      throw createSqlParseError(
        'expected_token',
        getSqlParserString(
          this.textModeStrings,
          'expectedToken',
          `Expected token "${type}" but found "${token.value}".`,
          { token: type, value: token.value }
        ),
        token.start,
        token.end
      );
    }

    return token;
  }

  private expectKeyword(value: string): IToken {
    const token = this.consume();

    if (token.type !== 'KEYWORD' || token.value !== value) {
      if (token.type === 'EOF') {
        throw createSqlParseError(
          'missing_keyword',
          getMissingSqlKeywordMessage(value, this.textModeStrings),
          token.start,
          token.end
        );
      }

      throw createSqlParseError(
        'expected_keyword',
        getSqlParserString(
          this.textModeStrings,
          'expectedKeyword',
          `Expected keyword "${value}" but found "${token.value}".`,
          { keyword: value, value: token.value }
        ),
        token.start,
        token.end
      );
    }

    return token;
  }

  private consume(): IToken {
    const token = this.tokens[this.index];
    this.index += 1;
    return token;
  }

  private peek(): IToken {
    return this.tokens[this.index];
  }

  private toTokenRange(token: IToken) {
    return {
      start: token.start,
      end: token.end,
    };
  }
}
