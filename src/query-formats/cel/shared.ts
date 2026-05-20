import type { QueryOperator } from '../../utils/query-tree';

export const quoteCelString = (value: string): string =>
  `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;

export const formatCelScalarValue = (
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

  return quoteCelString(value);
};

export const formatCelArrayValue = (value: Array<string | number>): string =>
  `[${value.map(item => formatCelScalarValue(item)).join(', ')}]`;

export const escapeCelRegex = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const inferCelMatchesOperator = (
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
