import { AQL_DEFAULT_VARIABLE_NAME } from './shared';

const extractVariableName = (input: string): string | undefined => {
  const match = input.match(/\bFOR\s+([A-Za-z_][A-Za-z0-9_]*)\s+IN\b/i);
  return match?.[1];
};

export const stripAqlVariableName = (
  identifier: string,
  variableName = AQL_DEFAULT_VARIABLE_NAME
): string =>
  identifier.startsWith(`${variableName}.`)
    ? identifier.slice(variableName.length + 1)
    : identifier;

export const extractAqlPredicate = (
  input: string
): { predicate: string; variableName?: string } => {
  const trimmedInput = input.trim().replace(/;$/, '');
  const variableName = extractVariableName(trimmedInput);
  const upperInput = trimmedInput.toUpperCase();
  const filterIndex = upperInput.indexOf('FILTER ');

  if (filterIndex === -1) {
    return { predicate: trimmedInput, variableName };
  }

  const predicateStart = filterIndex + 7;
  const predicate = trimmedInput.slice(predicateStart);
  let depth = 0;
  let inString = false;
  let stringQuote = '';

  for (let index = 0; index < predicate.length; index += 1) {
    const char = predicate[index];

    if ((char === '"' || char === "'") && predicate[index - 1] !== '\\') {
      if (!inString) {
        inString = true;
        stringQuote = char;
      } else if (stringQuote === char) {
        inString = false;
        stringQuote = '';
      }
      continue;
    }

    if (inString) {
      continue;
    }

    if (char === '(' || char === '[') {
      depth += 1;
      continue;
    }

    if (char === ')' || char === ']') {
      depth = Math.max(0, depth - 1);
      continue;
    }

    if (depth === 0) {
      const tail = predicate.slice(index).toUpperCase();

      if (
        tail.startsWith('RETURN ') ||
        tail.startsWith('SORT ') ||
        tail.startsWith('LIMIT ') ||
        tail.startsWith('LET ')
      ) {
        return {
          predicate: predicate.slice(0, index).trim(),
          variableName,
        };
      }
    }
  }

  return { predicate: predicate.trim(), variableName };
};

