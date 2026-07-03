import type {
  IDenormalizedRuleNode,
  QueryOperator,
  QueryRuleValue,
} from '../../utils/query-tree';
import { isFieldComparisonRule } from '../../utils/rule-value-source';
import {
  formatAqlArrayValue,
  formatAqlScalarValue,
  quoteAqlIdentifier,
} from './shared';

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

const formatFieldOrScalarValue = (
  rule: IDenormalizedRuleNode,
  variableName: string
): string =>
  isFieldComparisonRule(rule)
    ? quoteAqlIdentifier(rule.valueField, variableName)
    : formatAqlScalarValue(rule.value as never);

export const formatAqlRule = (
  rule: IDenormalizedRuleNode,
  variableName: string
): string => {
  const field = quoteAqlIdentifier(rule.field, variableName);

  switch (rule.operator) {
    case 'EQUAL':
      return `${field} == ${formatFieldOrScalarValue(rule, variableName)}`;
    case 'NOT_EQUAL':
      return `${field} != ${formatFieldOrScalarValue(rule, variableName)}`;
    case 'LARGER':
      return `${field} > ${formatFieldOrScalarValue(rule, variableName)}`;
    case 'LARGER_EQUAL':
      return `${field} >= ${formatFieldOrScalarValue(rule, variableName)}`;
    case 'SMALLER':
      return `${field} < ${formatFieldOrScalarValue(rule, variableName)}`;
    case 'SMALLER_EQUAL':
      return `${field} <= ${formatFieldOrScalarValue(rule, variableName)}`;
    case 'IN':
    case 'ANY_IN':
      return `${field} IN ${formatAqlArrayValue(
        ensureArrayValue(rule.operator, rule.value)
      )}`;
    case 'NOT_IN':
      return `${field} NOT IN ${formatAqlArrayValue(
        ensureArrayValue(rule.operator, rule.value)
      )}`;
    case 'ALL_IN':
      return `${formatAqlArrayValue(
        ensureArrayValue(rule.operator, rule.value)
      )} ALL IN ${field}`;
    case 'BETWEEN': {
      const [start, end] = ensureRangeValue(rule.operator, rule.value);
      return `(${field} >= ${formatAqlScalarValue(
        start
      )} AND ${field} <= ${formatAqlScalarValue(end)})`;
    }
    case 'NOT_BETWEEN': {
      const [start, end] = ensureRangeValue(rule.operator, rule.value);
      return `(${field} < ${formatAqlScalarValue(
        start
      )} OR ${field} > ${formatAqlScalarValue(end)})`;
    }
    case 'IS_NULL':
      return `${field} == null`;
    case 'IS_NOT_NULL':
      return `${field} != null`;
    case 'CONTAINS':
      return `${field} LIKE ${formatAqlScalarValue(
        `%${ensureStringValue(rule.operator, rule.value)}%`
      )}`;
    case 'NOT_CONTAINS':
      return `${field} NOT LIKE ${formatAqlScalarValue(
        `%${ensureStringValue(rule.operator, rule.value)}%`
      )}`;
    case 'STARTS_WITH':
      return `${field} LIKE ${formatAqlScalarValue(
        `${ensureStringValue(rule.operator, rule.value)}%`
      )}`;
    case 'ENDS_WITH':
      return `${field} LIKE ${formatAqlScalarValue(
        `%${ensureStringValue(rule.operator, rule.value)}`
      )}`;
    case 'LIKE':
      return `${field} LIKE ${formatAqlScalarValue(
        ensureStringValue(rule.operator, rule.value)
      )}`;
    case 'NOT_LIKE':
      return `${field} NOT LIKE ${formatAqlScalarValue(
        ensureStringValue(rule.operator, rule.value)
      )}`;
    default:
      throw new Error(
        `Unsupported or missing operator "${rule.operator}" for field "${rule.field}".`
      );
  }
};
