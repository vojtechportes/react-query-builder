import type { QueryOperator } from '../../utils/query-tree';

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export const prismaFieldReferenceKey = '$ref';

export const createPrismaFieldReference = (field: string): Record<string, string> => ({
  [prismaFieldReferenceKey]: field,
});

export const parsePrismaFieldReference = (value: unknown): string | null => {
  if (!isPlainObject(value) || Object.keys(value).length !== 1) {
    return null;
  }

  return typeof value[prismaFieldReferenceKey] === 'string'
    ? value[prismaFieldReferenceKey]
    : null;
};

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
