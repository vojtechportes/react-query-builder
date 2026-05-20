import type {
  IDenormalizedRuleNode,
  QueryOperator,
  QueryRuleValue,
} from '../../utils/query-tree';
import { escapeRegexPattern } from './shared';

type MongoFieldValue = QueryRuleValue | Record<string, unknown>;

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

const createRegexExpression = (pattern: string): Record<string, unknown> => ({
  $regex: pattern,
});

const createNegatedRegexExpression = (
  pattern: string
): Record<string, unknown> => ({
  $not: createRegexExpression(pattern),
});

const createBetweenExpression = (
  value: [string, string] | [number, number]
): Record<string, unknown> => ({
  $gte: value[0],
  $lte: value[1],
});

const createNotBetweenExpression = (
  field: string,
  value: [string, string] | [number, number]
): Record<string, unknown> => ({
  $or: [
    { [field]: { $lt: value[0] } },
    { [field]: { $gt: value[1] } },
  ],
});

export const formatMongoRule = (
  rule: IDenormalizedRuleNode
): Record<string, MongoFieldValue> => {
  switch (rule.operator) {
    case 'EQUAL':
      return { [rule.field]: rule.value as QueryRuleValue };
    case 'NOT_EQUAL':
      return { [rule.field]: { $ne: rule.value } };
    case 'LARGER':
      return { [rule.field]: { $gt: rule.value } };
    case 'LARGER_EQUAL':
      return { [rule.field]: { $gte: rule.value } };
    case 'SMALLER':
      return { [rule.field]: { $lt: rule.value } };
    case 'SMALLER_EQUAL':
      return { [rule.field]: { $lte: rule.value } };
    case 'IN':
    case 'ANY_IN':
      return { [rule.field]: { $in: ensureArrayValue(rule.operator, rule.value) } };
    case 'NOT_IN':
      return { [rule.field]: { $nin: ensureArrayValue(rule.operator, rule.value) } };
    case 'ALL_IN':
      return { [rule.field]: { $all: ensureArrayValue(rule.operator, rule.value) } };
    case 'BETWEEN':
      return {
        [rule.field]: createBetweenExpression(
          ensureRangeValue(rule.operator, rule.value)
        ),
      };
    case 'NOT_BETWEEN':
      return createNotBetweenExpression(
        rule.field,
        ensureRangeValue(rule.operator, rule.value)
      ) as Record<string, MongoFieldValue>;
    case 'IS_NULL':
      return { [rule.field]: { $eq: null } };
    case 'IS_NOT_NULL':
      return { [rule.field]: { $ne: null } };
    case 'CONTAINS':
      return {
        [rule.field]: createRegexExpression(
          escapeRegexPattern(ensureStringValue(rule.operator, rule.value))
        ),
      };
    case 'NOT_CONTAINS':
      return {
        [rule.field]: createNegatedRegexExpression(
          escapeRegexPattern(ensureStringValue(rule.operator, rule.value))
        ),
      };
    case 'STARTS_WITH':
      return {
        [rule.field]: createRegexExpression(
          `^${escapeRegexPattern(ensureStringValue(rule.operator, rule.value))}`
        ),
      };
    case 'ENDS_WITH':
      return {
        [rule.field]: createRegexExpression(
          `${escapeRegexPattern(ensureStringValue(rule.operator, rule.value))}$`
        ),
      };
    case 'LIKE':
      return {
        [rule.field]: createRegexExpression(
          `^${escapeRegexPattern(ensureStringValue(rule.operator, rule.value))}$`
        ),
      };
    case 'NOT_LIKE':
      return {
        [rule.field]: createNegatedRegexExpression(
          `^${escapeRegexPattern(ensureStringValue(rule.operator, rule.value))}$`
        ),
      };
    default:
      throw new Error(
        `Unsupported or missing operator "${rule.operator}" for field "${rule.field}".`
      );
  }
};

