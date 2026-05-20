import type { QueryOperator } from '../../utils/query-tree';

export const quoteODataString = (value: string): string =>
  `'${value.replace(/'/g, "''")}'`;

export const formatODataScalarValue = (
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

  return quoteODataString(value);
};

export const inferODataStringOperator = (
  functionName: string,
  value: string,
  negated = false
): { operator: QueryOperator; value: string } => {
  if (functionName === 'contains') {
    return {
      operator: negated ? 'NOT_CONTAINS' : 'CONTAINS',
      value,
    };
  }

  if (functionName === 'startswith') {
    return {
      operator: negated ? 'NOT_LIKE' : 'STARTS_WITH',
      value,
    };
  }

  return {
    operator: negated ? 'NOT_LIKE' : 'ENDS_WITH',
    value,
  };
};
