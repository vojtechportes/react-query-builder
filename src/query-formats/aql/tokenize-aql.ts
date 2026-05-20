import { AQL_KEYWORDS, IAqlToken } from './aql-token.types';
import { extractAqlPredicate } from './extract-aql-predicate';

const coerceAqlKeyword = (value: string): IAqlToken => {
  const upperValue = value.toUpperCase();

  if (AQL_KEYWORDS.has(upperValue)) {
    return { type: 'KEYWORD', value: upperValue };
  }

  return { type: 'IDENTIFIER', value };
};

export const tokenizeAql = (
  input: string
): { tokens: IAqlToken[]; variableName?: string } => {
  const { predicate, variableName } = extractAqlPredicate(input);
  const tokens: IAqlToken[] = [];
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

    if (char === '"' || char === "'") {
      const quote = char;
      let value = '';
      index += 1;

      while (index < predicate.length) {
        const currentChar = predicate[index];

        if (currentChar === '\\' && index + 1 < predicate.length) {
          value += predicate[index + 1];
          index += 2;
          continue;
        }

        if (currentChar === quote) {
          index += 1;
          break;
        }

        value += currentChar;
        index += 1;
      }

      tokens.push({ type: 'STRING', value });
      continue;
    }

    if (/[<>!=]/.test(char)) {
      const next = predicate[index + 1];
      const pair = `${char}${next || ''}`;

      if (pair === '>=' || pair === '<=' || pair === '==' || pair === '!=') {
        tokens.push({ type: 'OPERATOR', value: pair });
        index += 2;
        continue;
      }

      tokens.push({ type: 'OPERATOR', value: char });
      index += 1;
      continue;
    }

    if (/[0-9]/.test(char) || (char === '-' && /[0-9]/.test(predicate[index + 1]))) {
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

      while (index < predicate.length && /[A-Za-z0-9_.]/.test(predicate[index])) {
        value += predicate[index];
        index += 1;
      }

      tokens.push(coerceAqlKeyword(value));
      continue;
    }

    throw new Error(`Unexpected token "${char}" in AQL expression.`);
  }

  tokens.push({ type: 'EOF', value: '' });
  return { tokens, variableName };
};

