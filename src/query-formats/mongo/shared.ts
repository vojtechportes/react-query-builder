import type { QueryOperator } from '../../utils/query-tree';

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export const mongoFieldReferencePrefix = '$';

export const createMongoFieldReference = (field: string): string =>
  `${mongoFieldReferencePrefix}${field}`;

export const parseMongoFieldReference = (value: unknown): string | null => {
  if (
    typeof value !== 'string' ||
    !value.startsWith(mongoFieldReferencePrefix) ||
    value.length === mongoFieldReferencePrefix.length
  ) {
    return null;
  }

  return value.slice(mongoFieldReferencePrefix.length);
};

export const escapeRegexPattern = (value: string): string =>
  value.replace(/[|\{}()\[\]^$+*?.]/g, '\\$&');

export const stripAnchors = (value: string): string =>
  value.replace(/^\^/, '').replace(/\$$/, '');

export const inferRegexOperator = (
  pattern: string,
  negated = false
): { operator: QueryOperator; value: string } => {
  const startsAnchored = pattern.startsWith('^');
  const endsAnchored = pattern.endsWith('$');
  const body = stripAnchors(pattern);

  if (!startsAnchored && !endsAnchored) {
    return {
      operator: negated ? 'NOT_CONTAINS' : 'CONTAINS',
      value: body,
    };
  }

  if (startsAnchored && endsAnchored) {
    return {
      operator: negated ? 'NOT_LIKE' : 'LIKE',
      value: body,
    };
  }

  if (startsAnchored) {
    return {
      operator: negated ? 'NOT_LIKE' : 'STARTS_WITH',
      value: body,
    };
  }

  return {
    operator: negated ? 'NOT_LIKE' : 'ENDS_WITH',
    value: body,
  };
};

export const isMongoDocument = (value: unknown): value is Record<string, unknown> =>
  isPlainObject(value);
