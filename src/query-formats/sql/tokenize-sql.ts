import type { IStrings } from '../../locales/types/strings';
import { extractSqlPredicate } from './extract-sql-predicate';
import { IToken, SQL_KEYWORDS } from './sql-token.types';
import { createSqlParseError } from './utils/create-sql-parse-error';
import { getSqlParserString } from './utils/get-sql-parser-string';
import { isSuspiciousSqlStringClose } from './utils/is-suspicious-sql-string-close';

const coerceSqlKeyword = (
  value: string,
  start: number,
  end: number
): IToken => {
  const upperValue = value.toUpperCase();

  if (SQL_KEYWORDS.has(upperValue)) {
    return { type: 'KEYWORD', value: upperValue, start, end };
  }

  return { type: 'IDENTIFIER', value, start, end };
};

export const tokenizeSql = (
  input: string,
  textModeStrings?: IStrings['textMode']
): IToken[] => {
  const tokens: IToken[] = [];
  const predicate = extractSqlPredicate(input);
  let index = 0;

  while (index < predicate.length) {
    const char = predicate[index];

    if (/\s/.test(char)) {
      index += 1;
      continue;
    }

    if (char === '(') {
      tokens.push({
        type: 'LPAREN',
        value: char,
        start: index,
        end: index + 1,
      });
      index += 1;
      continue;
    }

    if (char === ')') {
      tokens.push({
        type: 'RPAREN',
        value: char,
        start: index,
        end: index + 1,
      });
      index += 1;
      continue;
    }

    if (char === ',') {
      tokens.push({ type: 'COMMA', value: char, start: index, end: index + 1 });
      index += 1;
      continue;
    }

    if (char === "'") {
      let value = '';
      let closed = false;
      const tokenStart = index;
      index += 1;

      while (index < predicate.length) {
        const currentChar = predicate[index];

        if (currentChar === "'" && predicate[index + 1] === "'") {
          value += "'";
          index += 2;
          continue;
        }

        if (currentChar === "'") {
          if (isSuspiciousSqlStringClose(predicate, index)) {
            throw createSqlParseError(
              'missing_quote',
              getSqlParserString(
                textModeStrings,
                'possibleMissingQuote',
                'Possible missing quote before this string boundary.'
              ),
              index,
              index + 1
            );
          }

          index += 1;
          closed = true;
          tokens.push({ type: 'STRING', value, start: tokenStart, end: index });
          break;
        }

        value += currentChar;
        index += 1;
      }

      if (!closed) {
        throw createSqlParseError(
          'missing_quote',
          getSqlParserString(
            textModeStrings,
            'missingClosingQuote',
            'Missing closing quote.'
          ),
          predicate.length,
          predicate.length
        );
      }
      continue;
    }

    if (char === '"') {
      let value = '';
      let closed = false;
      const tokenStart = index;
      index += 1;

      while (index < predicate.length) {
        const currentChar = predicate[index];

        if (currentChar === '"' && predicate[index + 1] === '"') {
          value += '"';
          index += 2;
          continue;
        }

        if (currentChar === '"') {
          index += 1;
          closed = true;
          tokens.push({
            type: 'IDENTIFIER',
            value,
            start: tokenStart,
            end: index,
          });
          break;
        }

        value += currentChar;
        index += 1;
      }

      if (!closed) {
        throw createSqlParseError(
          'missing_identifier_quote',
          getSqlParserString(
            textModeStrings,
            'missingClosingIdentifierQuote',
            'Missing closing identifier quote.'
          ),
          predicate.length,
          predicate.length
        );
      }
      continue;
    }

    if (/[<>!=]/.test(char)) {
      const next = predicate[index + 1];
      const pair = `${char}${next || ''}`;

      if (pair === '>=' || pair === '<=' || pair === '<>' || pair === '!=') {
        tokens.push({
          type: 'OPERATOR',
          value: pair,
          start: index,
          end: index + 2,
        });
        index += 2;
        continue;
      }

      tokens.push({
        type: 'OPERATOR',
        value: char,
        start: index,
        end: index + 1,
      });
      index += 1;
      continue;
    }

    if (
      /[0-9]/.test(char) ||
      (char === '-' && /[0-9]/.test(predicate[index + 1]))
    ) {
      let value = char;
      const start = index;
      index += 1;

      while (index < predicate.length && /[0-9.]/.test(predicate[index])) {
        value += predicate[index];
        index += 1;
      }

      tokens.push({ type: 'NUMBER', value, start, end: index });
      continue;
    }

    if (/[A-Za-z_]/.test(char)) {
      let value = char;
      const start = index;
      index += 1;

      while (
        index < predicate.length &&
        /[A-Za-z0-9_$.]/.test(predicate[index])
      ) {
        value += predicate[index];
        index += 1;
      }

      tokens.push(coerceSqlKeyword(value, start, index));
      continue;
    }

    throw createSqlParseError(
      'unexpected_token',
      getSqlParserString(
        textModeStrings,
        'unexpectedTokenInExpression',
        `Unexpected token "${char}" in SQL expression.`,
        { token: char }
      ),
      index,
      index + 1
    );
  }

  tokens.push({
    type: 'EOF',
    value: '',
    start: predicate.length,
    end: predicate.length,
  });
  return tokens;
};
