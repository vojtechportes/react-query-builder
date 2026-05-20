import { extractODataFilter } from './extract-odata-filter';
import { ODATA_KEYWORDS, type IODataToken } from './odata-token.types';

const coerceWord = (value: string): IODataToken => {
  if (ODATA_KEYWORDS.has(value)) {
    return { type: 'KEYWORD', value };
  }

  return { type: 'IDENTIFIER', value };
};

export const tokenizeOData = (input: string): IODataToken[] => {
  const source = extractODataFilter(input);
  const tokens: IODataToken[] = [];
  let index = 0;

  while (index < source.length) {
    const char = source[index];

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

      while (index < source.length) {
        const current = source[index];
        const next = source[index + 1];

        if (current === "'" && next === "'") {
          value += "'";
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

    if (/[0-9]/.test(char) || (char === '-' && /[0-9]/.test(source[index + 1]))) {
      let value = char;
      index += 1;

      while (index < source.length && /[0-9.]/.test(source[index])) {
        value += source[index];
        index += 1;
      }

      tokens.push({ type: 'NUMBER', value });
      continue;
    }

    if (/[A-Za-z_$]/.test(char)) {
      let value = char;
      index += 1;

      while (index < source.length && /[A-Za-z0-9_./$]/.test(source[index])) {
        value += source[index];
        index += 1;
      }

      tokens.push(coerceWord(value));
      continue;
    }

    throw new Error(`Unexpected token "${char}" in OData expression.`);
  }

  tokens.push({ type: 'EOF', value: '' });
  return tokens;
};
