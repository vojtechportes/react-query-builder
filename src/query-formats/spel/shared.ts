import type { QueryOperator } from '../../utils/query-tree';

export const quoteSpelString = (value: string): string =>
  `'${value.replace(/'/g, "''")}'`;

export const formatSpelScalarValue = (
  value: string | number | boolean | null
): string => {
  if (value === null) {
    return 'null';
  }

  if (typeof value === 'number') {
    return `${value}`;
  }

  if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  }

  return quoteSpelString(value);
};

export const formatSpelArrayValue = (value: Array<string | number>): string =>
  `{${value.map(item => formatSpelScalarValue(item)).join(', ')}}`;

export const escapeSpelRegex = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const inferSpelMatchesOperator = (
  pattern: string,
  negated = false
): { operator: QueryOperator; value: string } => {
  const startsAnchored = pattern.startsWith('^');
  const endsAnchored = pattern.endsWith('$');
  const normalizedValue = pattern.replace(/^\^/, '').replace(/\$$/, '');

  if (startsAnchored && endsAnchored) {
    return {
      operator: negated ? 'NOT_LIKE' : 'LIKE',
      value: normalizedValue,
    };
  }

  if (startsAnchored) {
    return {
      operator: 'STARTS_WITH',
      value: normalizedValue,
    };
  }

  if (endsAnchored) {
    return {
      operator: 'ENDS_WITH',
      value: normalizedValue,
    };
  }

  return {
    operator: negated ? 'NOT_CONTAINS' : 'CONTAINS',
    value: normalizedValue,
  };
};
