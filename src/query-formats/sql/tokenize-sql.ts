import { extractSqlPredicate } from './extract-sql-predicate';
import { IToken, SQL_KEYWORDS } from './sql-token.types';

const coerceSqlKeyword = (value: string): IToken => {
  const upperValue = value.toUpperCase();

  if (SQL_KEYWORDS.has(upperValue)) {
    return { type: 'KEYWORD', value: upperValue };
  }

  return { type: 'IDENTIFIER', value };
};

export const tokenizeSql = (input: string): IToken[] => {
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
      tokens.push({ type: 'LPAREN', value: char });
      index += 1;
      continue;
    }

    if (char === ')') {
      tokens.push({ type: 'RPAREN', value: char });
      index += 1;
      continue;
    }

    if (char === ',') {
      tokens.push({ type: 'COMMA', value: char });
      index += 1;
      continue;
    }

    if (char === "'") {
      let value = '';
      index += 1;

      while (index < predicate.length) {
        const currentChar = predicate[index];

        if (currentChar === "'" && predicate[index + 1] === "'") {
          value += "'";
          index += 2;
          continue;
        }

        if (currentChar === "'") {
          index += 1;
          break;
        }

        value += currentChar;
        index += 1;
      }

      tokens.push({ type: 'STRING', value });
      continue;
    }

    if (char === '"') {
      let value = '';
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
          break;
        }

        value += currentChar;
        index += 1;
      }

      tokens.push({ type: 'IDENTIFIER', value });
      continue;
    }

    if (/[<>!=]/.test(char)) {
      const next = predicate[index + 1];
      const pair = `${char}${next || ''}`;

      if (pair === '>=' || pair === '<=' || pair === '<>' || pair === '!=') {
        tokens.push({ type: 'OPERATOR', value: pair });
        index += 2;
        continue;
      }

      tokens.push({ type: 'OPERATOR', value: char });
      index += 1;
      continue;
    }

    if (
      /[0-9]/.test(char) ||
      (char === '-' && /[0-9]/.test(predicate[index + 1]))
    ) {
      let value = char;
      index += 1;

      while (index < predicate.length && /[0-9.]/.test(predicate[index])) {
        value += predicate[index];
        index += 1;
      }

      tokens.push({ type: 'NUMBER', value });
      continue;
    }

    if (/[A-Za-z_]/.test(char)) {
      let value = char;
      index += 1;

      while (index < predicate.length && /[A-Za-z0-9_$.]/.test(predicate[index])) {
        value += predicate[index];
        index += 1;
      }

      tokens.push(coerceSqlKeyword(value));
      continue;
    }

    throw new Error(`Unexpected token "${char}" in SQL expression.`);
  }

  tokens.push({ type: 'EOF', value: '' });
  return tokens;
};

