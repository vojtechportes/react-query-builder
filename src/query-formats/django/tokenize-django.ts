import { DJANGO_KEYWORDS, type IDjangoToken } from './django-token.types';

const coerceWord = (value: string): IDjangoToken => {
  if (DJANGO_KEYWORDS.has(value)) {
    return { type: 'KEYWORD', value };
  }

  return { type: 'IDENTIFIER', value };
};

export const tokenizeDjango = (input: string): IDjangoToken[] => {
  const tokens: IDjangoToken[] = [];
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

    if (char === '[') {
      tokens.push({ type: 'LBRACKET', value: char });
      index += 1;
      continue;
    }

    if (char === ']') {
      tokens.push({ type: 'RBRACKET', value: char });
      index += 1;
      continue;
    }

    if (char === ',') {
      tokens.push({ type: 'COMMA', value: char });
      index += 1;
      continue;
    }

    if (char === '&') {
      tokens.push({ type: 'AMP', value: char });
      index += 1;
      continue;
    }

    if (char === '|') {
      tokens.push({ type: 'PIPE', value: char });
      index += 1;
      continue;
    }

    if (char === '~') {
      tokens.push({ type: 'TILDE', value: char });
      index += 1;
      continue;
    }

    if (char === '=') {
      tokens.push({ type: 'EQUAL', value: char });
      index += 1;
      continue;
    }

    if (char === "'" || char === '"') {
      const quote = char;
      let value = '';
      index += 1;

      while (index < input.length) {
        const current = input[index];

        if (current === '\\') {
          const next = input[index + 1];

          if (next === undefined) {
            throw new Error('Unterminated escape sequence in Django expression.');
          }

          value += next;
          index += 2;
          continue;
        }

        if (current === quote) {
          index += 1;
          break;
        }

        value += current;
        index += 1;
      }

      tokens.push({ type: 'STRING', value });
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

      while (index < input.length && /[A-Za-z0-9_]/.test(input[index])) {
        value += input[index];
        index += 1;
      }

      tokens.push(coerceWord(value));
      continue;
    }

    throw new Error(`Unexpected token "${char}" in Django expression.`);
  }

  tokens.push({ type: 'EOF', value: '' });
  return tokens;
};
