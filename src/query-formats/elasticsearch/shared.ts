import type { QueryOperator } from '../../utils/query-tree';

export const escapeElasticsearchWildcard = (value: string): string =>
  value.replace(/([\\*?])/g, '\\$1');

export const inferWildcardOperator = (
  pattern: string,
  negated = false
): { operator: QueryOperator; value: string } => {
  const startsWildcard = pattern.startsWith('*');
  const endsWildcard = pattern.endsWith('*');
  const body = pattern.replace(/^\*/, '').replace(/\*$/, '');

  if (startsWildcard && endsWildcard) {
    return {
      operator: negated ? 'NOT_CONTAINS' : 'CONTAINS',
      value: body,
    };
  }

  if (endsWildcard) {
    return {
      operator: negated ? 'NOT_LIKE' : 'STARTS_WITH',
      value: body,
    };
  }

  if (startsWildcard) {
    return {
      operator: negated ? 'NOT_LIKE' : 'ENDS_WITH',
      value: body,
    };
  }

  return {
    operator: negated ? 'NOT_LIKE' : 'LIKE',
    value: body,
  };
};
