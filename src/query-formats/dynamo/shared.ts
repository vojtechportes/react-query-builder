import type { QueryOperator, QueryRuleValue } from '../../utils/query-tree';

export const quoteDynamoString = (value: string): string =>
  `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;

export const formatDynamoScalarValue = (
  value: Exclude<QueryRuleValue, string[] | number[]>
): string => {
  if (typeof value === 'number') {
    return `${value}`;
  }

  if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  }

  return quoteDynamoString(value);
};

export const inferDynamoStringOperator = (
  functionName: string,
  negated = false
): QueryOperator => {
  if (functionName === 'contains') {
    return negated ? 'NOT_CONTAINS' : 'CONTAINS';
  }

  return negated ? 'NOT_LIKE' : 'STARTS_WITH';
};
