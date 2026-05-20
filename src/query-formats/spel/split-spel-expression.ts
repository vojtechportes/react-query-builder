const isWrappedByParentheses = (value: string): boolean => {
  if (!value.startsWith('(') || !value.endsWith(')')) {
    return false;
  }

  let depth = 0;
  let inString = false;

  for (let index = 0; index < value.length; index += 1) {
    const char = value[index];
    const next = value[index + 1];

    if (char === "'" && next === "'") {
      index += 1;
      continue;
    }

    if (char === "'") {
      inString = !inString;
      continue;
    }

    if (inString) {
      continue;
    }

    if (char === '(') {
      depth += 1;
      continue;
    }

    if (char === ')') {
      depth -= 1;

      if (depth === 0 && index < value.length - 1) {
        return false;
      }
    }
  }

  return depth === 0;
};

export const stripOuterParentheses = (value: string): string => {
  let current = value.trim();

  while (isWrappedByParentheses(current)) {
    current = current.slice(1, -1).trim();
  }

  return current;
};

export const splitTopLevel = (
  value: string,
  delimiter: ' and ' | ' or '
): string[] => {
  const parts: string[] = [];
  let depthParen = 0;
  let depthBrace = 0;
  let depthBracket = 0;
  let inString = false;
  let lastIndex = 0;

  for (let index = 0; index < value.length; index += 1) {
    const char = value[index];
    const next = value[index + 1];

    if (char === "'" && next === "'") {
      index += 1;
      continue;
    }

    if (char === "'") {
      inString = !inString;
      continue;
    }

    if (inString) {
      continue;
    }

    if (char === '(') {
      depthParen += 1;
      continue;
    }

    if (char === ')') {
      depthParen -= 1;
      continue;
    }

    if (char === '{') {
      depthBrace += 1;
      continue;
    }

    if (char === '}') {
      depthBrace -= 1;
      continue;
    }

    if (char === '[') {
      depthBracket += 1;
      continue;
    }

    if (char === ']') {
      depthBracket -= 1;
      continue;
    }

    if (
      depthParen === 0 &&
      depthBrace === 0 &&
      depthBracket === 0 &&
      value.slice(index, index + delimiter.length) === delimiter
    ) {
      parts.push(value.slice(lastIndex, index).trim());
      lastIndex = index + delimiter.length;
      index += delimiter.length - 1;
    }
  }

  if (lastIndex === 0) {
    return [value.trim()];
  }

  parts.push(value.slice(lastIndex).trim());
  return parts;
};
