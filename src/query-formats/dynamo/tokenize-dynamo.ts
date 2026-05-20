import { DYNAMO_KEYWORDS, type IDynamoToken } from './dynamo-token.types';

const coerceWord = (value: string): IDynamoToken => {
  if (DYNAMO_KEYWORDS.has(value)) {
    return { type: 'KEYWORD', value };
  }

  return { type: 'IDENTIFIER', value };
};

export const tokenizeDynamo = (input: string): IDynamoToken[] => {
  const tokens: IDynamoToken[] = [];
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

    if (char === "'") {
      let value = '';
      index += 1;

      while (index < input.length) {
        const current = input[index];

        if (current === '\\') {
          const next = input[index + 1];

          if (next === undefined) {
            throw new Error('Unterminated escape sequence in Dynamo expression.');
          }

          value += next;
          index += 2;
          continue;
        }

        if (current === "'") {
          index += 1;
          break;
        }

        value += current;
        index += 1;
      }

      tokens.push({ type: 'STRING', value });
      continue;
    }

    if (/[<>!=]/.test(char)) {
      const next = input[index + 1];
      const pair = `${char}${next || ''}`;

      if (pair === '>=' || pair === '<=' || pair === '<>') {
        tokens.push({ type: 'OPERATOR', value: pair });
        index += 2;
        continue;
      }

      tokens.push({ type: 'OPERATOR', value: char });
      index += 1;
      continue;
    }

    if (/[0-9]/.test(char) || (char === '-' && /[0-9]/.test(input[index + 1]))) {
      let value = char;
      index += 1;

      while (index < input.length && /[0-9.]/.test(input[index])) {
        value += input[index];
        index += 1;
      }

      tokens.push({ type: 'NUMBER', value });
      continue;
    }

    if (/[A-Za-z_]/.test(char)) {
      let value = char;
      index += 1;

      while (index < input.length && /[A-Za-z0-9_$.]/.test(input[index])) {
        value += input[index];
        index += 1;
      }

      tokens.push(coerceWord(value));
      continue;
    }

    throw new Error(`Unexpected token "${char}" in Dynamo expression.`);
  }

  tokens.push({ type: 'EOF', value: '' });
  return tokens;
};
