import type { DenormalizedNode } from '../../utils/query-tree';
import { inferPrismaStringOperator } from './shared';

type PrismaDocument = Record<string, unknown>;

const isPlainObject = (value: unknown): value is PrismaDocument =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const buildAndGroup = (children: DenormalizedNode[]): DenormalizedNode => ({
  type: 'GROUP',
  value: 'AND',
  isNegated: false,
  children,
});

const createLogicalGroup = (
  combinator: 'AND' | 'OR',
  items: unknown[],
  negated = false
): DenormalizedNode => ({
  type: 'GROUP',
  value: combinator,
  isNegated: negated,
  children: items.flatMap(item => parsePrismaExpression(item)),
});

const parseFieldOperatorExpression = (
  field: string,
  value: PrismaDocument
): DenormalizedNode[] => {
  const operatorKeys = Object.keys(value);

  if (operatorKeys.length === 0) {
    throw new Error(`Prisma field expression for "${field}" cannot be empty.`);
  }

  if (
    operatorKeys.length === 2 &&
    operatorKeys.includes('gte') &&
    operatorKeys.includes('lte')
  ) {
    return [
      {
        field,
        operator: 'BETWEEN',
        value: [value.gte, value.lte] as string[] | number[],
      },
    ];
  }

  if (operatorKeys.length === 1) {
    const [operatorKey] = operatorKeys;

    switch (operatorKey) {
      case 'equals':
        return [{ field, operator: 'LIKE', value: value.equals as never }];
      case 'gt':
        return [{ field, operator: 'LARGER', value: value.gt as never }];
      case 'gte':
        return [{ field, operator: 'LARGER_EQUAL', value: value.gte as never }];
      case 'lt':
        return [{ field, operator: 'SMALLER', value: value.lt as never }];
      case 'lte':
        return [{ field, operator: 'SMALLER_EQUAL', value: value.lte as never }];
      case 'in':
        return [{ field, operator: 'IN', value: value.in as never }];
      case 'notIn':
        return [{ field, operator: 'NOT_IN', value: value.notIn as never }];
      case 'hasEvery':
        return [{ field, operator: 'ALL_IN', value: value.hasEvery as never }];
      case 'hasSome':
        return [{ field, operator: 'ANY_IN', value: value.hasSome as never }];
      case 'contains':
        return [{ field, operator: 'CONTAINS', value: value.contains as never }];
      case 'startsWith':
        return [{ field, operator: 'STARTS_WITH', value: value.startsWith as never }];
      case 'endsWith':
        return [{ field, operator: 'ENDS_WITH', value: value.endsWith as never }];
      case 'not':
        if (value.not === null) {
          return [{ field, operator: 'IS_NOT_NULL' }];
        }

        if (!isPlainObject(value.not)) {
          return [{ field, operator: 'NOT_EQUAL', value: value.not as never }];
        }

        if (
          'lt' in value.not &&
          'gt' in value.not &&
          Object.keys(value.not).length === 2
        ) {
          return [
            {
              field,
              operator: 'NOT_BETWEEN',
              value: [value.not.lt, value.not.gt] as string[] | number[],
            },
          ];
        }

        const stringOperator = inferPrismaStringOperator(value.not, true);

        if (stringOperator) {
          return [{ field, ...stringOperator }];
        }

        if ('equals' in value.not) {
          return [{ field, operator: 'NOT_LIKE', value: value.not.equals as never }];
        }

        throw new Error(`Unsupported Prisma not expression for field "${field}".`);
      default:
        throw new Error(`Unsupported Prisma operator "${operatorKey}" for field "${field}".`);
    }
  }

  return operatorKeys.flatMap(operatorKey =>
    parseFieldOperatorExpression(field, { [operatorKey]: value[operatorKey] })
  );
};

const isSameFieldRangeBoundaryGroup = (
  items: unknown[]
): items is Array<Record<string, { lt?: unknown; gt?: unknown }>> => {
  if (items.length !== 2) {
    return false;
  }

  const [first, second] = items;

  if (!isPlainObject(first) || !isPlainObject(second)) {
    return false;
  }

  const [firstField] = Object.keys(first);
  const [secondField] = Object.keys(second);

  if (!firstField || !secondField || firstField !== secondField) {
    return false;
  }

  return (
    isPlainObject(first[firstField]) &&
    isPlainObject(second[secondField]) &&
    'lt' in first[firstField] &&
    'gt' in second[secondField]
  );
};

const parseRootDocument = (document: PrismaDocument): DenormalizedNode[] =>
  Object.entries(document).flatMap(([key, value]) => {
    if (key === 'AND') {
      if (!Array.isArray(value)) {
        throw new Error('Prisma AND must be an array.');
      }

      return [createLogicalGroup('AND', value)];
    }

    if (key === 'OR') {
      if (!Array.isArray(value)) {
        throw new Error('Prisma OR must be an array.');
      }

      if (isSameFieldRangeBoundaryGroup(value)) {
        const field = Object.keys(value[0])[0];
        const lowerBound = (value[0][field] as { lt: unknown }).lt;
        const upperBound = (value[1][field] as { gt: unknown }).gt;

        return [
          {
            field,
            operator: 'NOT_BETWEEN',
            value: [lowerBound, upperBound] as string[] | number[],
          },
        ];
      }

      return [createLogicalGroup('OR', value)];
    }

    if (key === 'NOT') {
      if (Array.isArray(value)) {
        return [createLogicalGroup('AND', value, true)];
      }

      return [
        {
          type: 'GROUP',
          value: 'AND',
          isNegated: true,
          children: parsePrismaExpression(value),
        },
      ];
    }

    if (value === null) {
      return [{ field: key, operator: 'IS_NULL' }];
    }

    if (isPlainObject(value)) {
      return parseFieldOperatorExpression(key, value);
    }

    return [
      {
        field: key,
        operator: 'EQUAL',
        value: value as never,
      },
    ];
  });

const unwrapWhereContainer = (value: PrismaDocument): PrismaDocument => {
  if ('where' in value && isPlainObject(value.where)) {
    return value.where;
  }

  return value;
};

export const parsePrismaExpression = (value: unknown): DenormalizedNode[] => {
  if (!isPlainObject(value)) {
    throw new Error('Prisma query must be a JSON object.');
  }

  const nodes = parseRootDocument(unwrapWhereContainer(value));

  if (nodes.length <= 1) {
    return nodes;
  }

  return [buildAndGroup(nodes)];
};
