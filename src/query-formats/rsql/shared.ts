import type { QueryOperator, QueryRuleValue } from '../../utils/query-tree';

const numberPattern = /^-?\d+(?:\.\d+)?$/;
const safeUnquotedPattern = /^[A-Za-z0-9_./:$-][A-Za-z0-9_./:$*-]*$/;

export const quoteRsqlString = (value: string): string =>
  `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;

export const formatRsqlValue = (
  value: Exclude<QueryRuleValue, string[] | number[]>
): string => {
  if (typeof value === 'number') {
    return `${value}`;
  }

  if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  }

  if (
    value.length > 0 &&
    safeUnquotedPattern.test(value) &&
    !numberPattern.test(value) &&
    value !== 'true' &&
    value !== 'false' &&
    value !== 'null'
  ) {
    return value;
  }

  return quoteRsqlString(value);
};

export const parseRsqlScalar = (
  value: string,
  quoted = false
): string | number | boolean | null => {
  if (quoted) {
    return value;
  }

  if (numberPattern.test(value)) {
    return Number(value);
  }

  if (value === 'true') {
    return true;
  }

  if (value === 'false') {
    return false;
  }

  if (value === 'null') {
    return null;
  }

  return value;
};

export const inferRsqlPatternOperator = (
  value: string,
  negated = false
): { operator: QueryOperator; value: string } => {
  if (value.startsWith('*') && value.endsWith('*') && value.length >= 2) {
    return {
      operator: negated ? 'NOT_CONTAINS' : 'CONTAINS',
      value: value.slice(1, -1),
    };
  }

  if (value.startsWith('*')) {
    return {
      operator: negated ? 'NOT_LIKE' : 'ENDS_WITH',
      value: value.slice(1),
    };
  }

  if (value.endsWith('*')) {
    return {
      operator: negated ? 'NOT_LIKE' : 'STARTS_WITH',
      value: value.slice(0, -1),
    };
  }

  return {
    operator: negated ? 'NOT_EQUAL' : 'EQUAL',
    value,
  };
};
