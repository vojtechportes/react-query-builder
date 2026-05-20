import type { QueryOperator } from '../../utils/query-tree';

export const AQL_DEFAULT_VARIABLE_NAME = 'doc';

export const escapeAqlString = (value: string): string =>
  value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');

export const quoteAqlString = (value: string): string =>
  `"${escapeAqlString(value)}"`;

export const quoteAqlIdentifier = (
  field: string,
  variableName = AQL_DEFAULT_VARIABLE_NAME
): string =>
  field
    .split('.')
    .filter(Boolean)
    .reduce((path, segment) => `${path}.${segment}`, variableName);

export const formatAqlScalarValue = (
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

  return quoteAqlString(value);
};

export const formatAqlArrayValue = (value: Array<string | number>): string =>
  `[${value.map(item => formatAqlScalarValue(item)).join(', ')}]`;

export const extractAqlLikeOperator = (
  pattern: string,
  negated = false
): { operator: QueryOperator; value: string } => {
  const startsWithWildcard = pattern.startsWith('%');
  const endsWithWildcard = pattern.endsWith('%');
  const normalizedValue = pattern.replace(/^%/, '').replace(/%$/, '');

  if (startsWithWildcard && endsWithWildcard) {
    return {
      operator: negated ? 'NOT_CONTAINS' : 'CONTAINS',
      value: normalizedValue,
    };
  }

  if (!startsWithWildcard && endsWithWildcard) {
    return {
      operator: 'STARTS_WITH',
      value: normalizedValue,
    };
  }

  if (startsWithWildcard && !endsWithWildcard) {
    return {
      operator: 'ENDS_WITH',
      value: normalizedValue,
    };
  }

  return {
    operator: negated ? 'NOT_LIKE' : 'LIKE',
    value: pattern,
  };
};

