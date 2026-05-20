import type { IRsqlToken } from './rsql-token.types';

const OPERATORS = ['=out=', '=in=', '=ge=', '=gt=', '=le=', '=lt=', '!=', '=='];

const tokenizeQuotedString = (
  source: string,
  start: number
): { value: string; nextIndex: number } => {
  const quote = source[start];
  let index = start + 1;
  let value = '';

  while (index < source.length) {
    const current = source[index];

    if (current === '\\') {
      const next = source[index + 1];

      if (next === undefined) {
        throw new Error('Unterminated escape sequence in RSQL string.');
      }

      value += next;
      index += 2;
      continue;
    }

    if (current === quote) {
      return {
        value,
        nextIndex: index + 1,
      };
    }

    value += current;
    index += 1;
  }

  throw new Error('Unterminated RSQL string literal.');
};

export const tokenizeRsql = (input: string): IRsqlToken[] => {
  const tokens: IRsqlToken[] = [];
  let index = 0;

  while (index < input.length) {
    const char = input[index];

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

    if (char === ';') {
      tokens.push({ type: 'SEMICOLON', value: char });
      index += 1;
      continue;
    }

    const operator = OPERATORS.find(candidate =>
      input.slice(index, index + candidate.length) === candidate
    );

    if (operator) {
      tokens.push({ type: 'OPERATOR', value: operator });
      index += operator.length;
      continue;
    }

    if (char === '"' || char === "'") {
      const { value, nextIndex } = tokenizeQuotedString(input, index);
      tokens.push({ type: 'STRING', value });
      index = nextIndex;
      continue;
    }

    let value = char;
    index += 1;

    while (
      index < input.length &&
      !/\s/.test(input[index]) &&
      !['(', ')', ',', ';'].includes(input[index])
    ) {
      const nextOperator = OPERATORS.find(candidate =>
        input.slice(index, index + candidate.length) === candidate
      );

      if (nextOperator) {
        break;
      }

      value += input[index];
      index += 1;
    }

    tokens.push({ type: 'VALUE', value });
  }

  tokens.push({ type: 'EOF', value: '' });
  return tokens;
};
