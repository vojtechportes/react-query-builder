import {
  SQL_STOP_CLAUSES,
} from './sql-token.types';

export const extractSqlPredicate = (input: string): string => {
  const trimmedInput = input.trim().replace(/;$/, '');
  const upperInput = trimmedInput.toUpperCase();
  const whereIndex = upperInput.indexOf(' WHERE ');

  if (whereIndex === -1) {
    return trimmedInput;
  }

  const predicate = trimmedInput.slice(whereIndex + 7);
  let depth = 0;
  let inString = false;

  for (let index = 0; index < predicate.length; index += 1) {
    const char = predicate[index];

    if (char === "'") {
      if (inString && predicate[index + 1] === "'") {
        index += 1;
        continue;
      }

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
      depth = Math.max(0, depth - 1);
      continue;
    }

    if (depth === 0 && /[A-Za-z]/.test(char)) {
      const tail = predicate.slice(index).toUpperCase();

      for (const clause of Array.from(SQL_STOP_CLAUSES)) {
        if (tail.startsWith(`${clause} `)) {
          return predicate.slice(0, index).trim();
        }
      }
    }
  }

  return predicate.trim();
};
