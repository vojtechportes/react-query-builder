import type {
  IDenormalizedRuleNode,
  QueryOperator,
  QueryRuleValue,
} from '../../utils/query-tree';

type PrismaClause = Record<string, unknown>;

const ensureArrayValue = (
  operator: QueryOperator | undefined,
  value: QueryRuleValue | undefined
): string[] | number[] => {
  if (!Array.isArray(value)) {
    throw new Error(`Operator "${operator}" requires an array value.`);
  }

  return value;
};

const ensureRangeValue = (
  operator: QueryOperator | undefined,
  value: QueryRuleValue | undefined
): [string, string] | [number, number] => {
  if (!Array.isArray(value) || value.length !== 2) {
    throw new Error(`Operator "${operator}" requires a two-item array value.`);
  }

  return value as [string, string] | [number, number];
};

const ensureStringValue = (
  operator: QueryOperator | undefined,
  value: QueryRuleValue | undefined
): string => {
  if (typeof value !== 'string') {
    throw new Error(`Operator "${operator}" requires a string value.`);
  }

  return value;
};

export const formatPrismaRule = (rule: IDenormalizedRuleNode): PrismaClause => {
  switch (rule.operator) {
    case 'EQUAL':
      return { [rule.field]: rule.value as QueryRuleValue };
    case 'NOT_EQUAL':
      return { [rule.field]: { not: rule.value } };
    case 'LARGER':
      return { [rule.field]: { gt: rule.value } };
    case 'LARGER_EQUAL':
      return { [rule.field]: { gte: rule.value } };
    case 'SMALLER':
      return { [rule.field]: { lt: rule.value } };
    case 'SMALLER_EQUAL':
      return { [rule.field]: { lte: rule.value } };
    case 'IN':
    case 'ANY_IN':
      return { [rule.field]: { in: ensureArrayValue(rule.operator, rule.value) } };
    case 'NOT_IN':
      return { [rule.field]: { notIn: ensureArrayValue(rule.operator, rule.value) } };
    case 'ALL_IN':
      return {
        [rule.field]: { hasEvery: ensureArrayValue(rule.operator, rule.value) },
      };
    case 'BETWEEN': {
      const [start, end] = ensureRangeValue(rule.operator, rule.value);
      return { [rule.field]: { gte: start, lte: end } };
    }
    case 'NOT_BETWEEN': {
      const [start, end] = ensureRangeValue(rule.operator, rule.value);
      return {
        OR: [
          { [rule.field]: { lt: start } },
          { [rule.field]: { gt: end } },
        ],
      };
    }
    case 'IS_NULL':
      return { [rule.field]: null };
    case 'IS_NOT_NULL':
      return { [rule.field]: { not: null } };
    case 'CONTAINS':
      return {
        [rule.field]: { contains: ensureStringValue(rule.operator, rule.value) },
      };
    case 'NOT_CONTAINS':
      return {
        [rule.field]: {
          not: { contains: ensureStringValue(rule.operator, rule.value) },
        },
      };
    case 'STARTS_WITH':
      return {
        [rule.field]: {
          startsWith: ensureStringValue(rule.operator, rule.value),
        },
      };
    case 'ENDS_WITH':
      return {
        [rule.field]: { endsWith: ensureStringValue(rule.operator, rule.value) },
      };
    case 'LIKE':
      return {
        [rule.field]: { equals: ensureStringValue(rule.operator, rule.value) },
      };
    case 'NOT_LIKE':
      return {
        [rule.field]: { not: { equals: ensureStringValue(rule.operator, rule.value) } },
      };
    default:
      throw new Error(
        `Unsupported or missing operator "${rule.operator}" for field "${rule.field}".`
      );
  }
};
