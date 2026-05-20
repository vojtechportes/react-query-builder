import type { QueryOperator } from '../../utils/query-tree';

export const quoteJsonataString = (value: string): string =>
  `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;

export const formatJsonataScalarValue = (
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

  return quoteJsonataString(value);
};

export const formatJsonataArrayValue = (value: Array<string | number>): string =>
  `[${value.map(item => formatJsonataScalarValue(item)).join(', ')}]`;

export const escapeJsonataRegex = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\//g, '\\/');

export const inferJsonataContainsOperator = (
  pattern: string,
  negated = false
): { operator: QueryOperator; value: string } => {
  const startsAnchored = pattern.startsWith('^');
  const endsAnchored = pattern.endsWith('$');
  const normalizedValue = pattern.replace(/^\^/, '').replace(/\$$/, '');

  if (!startsAnchored && !endsAnchored) {
    return {
      operator: negated ? 'NOT_CONTAINS' : 'CONTAINS',
      value: normalizedValue,
    };
  }

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

  return {
    operator: 'ENDS_WITH',
    value: normalizedValue,
  };
};

