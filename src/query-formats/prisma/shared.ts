import type { QueryOperator } from '../../utils/query-tree';

export const inferPrismaStringOperator = (
  config: Record<string, unknown>,
  negated = false
): { operator: QueryOperator; value: string } | null => {
  if (typeof config.contains === 'string') {
    return {
      operator: negated ? 'NOT_CONTAINS' : 'CONTAINS',
      value: config.contains,
    };
  }

  if (typeof config.startsWith === 'string') {
    return {
      operator: negated ? 'NOT_LIKE' : 'STARTS_WITH',
      value: config.startsWith,
    };
  }

  if (typeof config.endsWith === 'string') {
    return {
      operator: negated ? 'NOT_LIKE' : 'ENDS_WITH',
      value: config.endsWith,
    };
  }

  if (typeof config.equals === 'string') {
    return {
      operator: negated ? 'NOT_LIKE' : 'LIKE',
      value: config.equals,
    };
  }

  return null;
};
