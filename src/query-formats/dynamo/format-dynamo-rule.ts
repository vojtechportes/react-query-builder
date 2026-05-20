import type {
  IDenormalizedRuleNode,
  QueryOperator,
  QueryRuleValue,
} from '../../utils/query-tree';
import { formatDynamoScalarValue } from './shared';

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

export const formatDynamoRule = (rule: IDenormalizedRuleNode): string => {
  switch (rule.operator) {
    case 'EQUAL':
      return `${rule.field} = ${formatDynamoScalarValue(rule.value as never)}`;
    case 'NOT_EQUAL':
      return `${rule.field} <> ${formatDynamoScalarValue(rule.value as never)}`;
    case 'LARGER':
      return `${rule.field} > ${formatDynamoScalarValue(rule.value as never)}`;
    case 'LARGER_EQUAL':
      return `${rule.field} >= ${formatDynamoScalarValue(rule.value as never)}`;
    case 'SMALLER':
      return `${rule.field} < ${formatDynamoScalarValue(rule.value as never)}`;
    case 'SMALLER_EQUAL':
      return `${rule.field} <= ${formatDynamoScalarValue(rule.value as never)}`;
    case 'IN':
    case 'ANY_IN':
      return `${rule.field} IN (${ensureArrayValue(rule.operator, rule.value)
        .map(value => formatDynamoScalarValue(value))
        .join(', ')})`;
    case 'NOT_IN': {
      const values = ensureArrayValue(rule.operator, rule.value)
        .map(value => `${rule.field} <> ${formatDynamoScalarValue(value)}`);
      return values.length === 1 ? values[0] : `(${values.join(' AND ')})`;
    }
    case 'ALL_IN': {
      const values = ensureArrayValue(rule.operator, rule.value)
        .map(value => `contains(${rule.field}, ${formatDynamoScalarValue(value)})`);
      return values.length === 1 ? values[0] : `(${values.join(' AND ')})`;
    }
    case 'BETWEEN': {
      const [start, end] = ensureRangeValue(rule.operator, rule.value);
      return `${rule.field} BETWEEN ${formatDynamoScalarValue(
        start
      )} AND ${formatDynamoScalarValue(end)}`;
    }
    case 'NOT_BETWEEN': {
      const [start, end] = ensureRangeValue(rule.operator, rule.value);
      return `(${rule.field} < ${formatDynamoScalarValue(
        start
      )} OR ${rule.field} > ${formatDynamoScalarValue(end)})`;
    }
    case 'IS_NULL':
      return `attribute_not_exists(${rule.field})`;
    case 'IS_NOT_NULL':
      return `attribute_exists(${rule.field})`;
    case 'CONTAINS':
      return `contains(${rule.field}, ${formatDynamoScalarValue(
        ensureStringValue(rule.operator, rule.value)
      )})`;
    case 'NOT_CONTAINS':
      return `NOT contains(${rule.field}, ${formatDynamoScalarValue(
        ensureStringValue(rule.operator, rule.value)
      )})`;
    case 'STARTS_WITH':
      return `begins_with(${rule.field}, ${formatDynamoScalarValue(
        ensureStringValue(rule.operator, rule.value)
      )})`;
    case 'ENDS_WITH':
      throw new Error('Dynamo formatting does not support ENDS_WITH.');
    case 'LIKE':
      return `${rule.field} = ${formatDynamoScalarValue(
        ensureStringValue(rule.operator, rule.value)
      )}`;
    case 'NOT_LIKE':
      return `${rule.field} <> ${formatDynamoScalarValue(
        ensureStringValue(rule.operator, rule.value)
      )}`;
    default:
      throw new Error(
        `Unsupported or missing operator "${rule.operator}" for field "${rule.field}".`
      );
  }
};
