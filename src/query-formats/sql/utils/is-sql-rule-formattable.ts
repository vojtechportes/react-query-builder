import type { IDenormalizedRuleNode } from '../../../utils/query-tree';
import { isFieldComparisonRule } from '../../../utils/rule-value-source';

const operatorsWithoutValue = new Set(['IS_NULL', 'IS_NOT_NULL']);
const operatorsWithArrayValue = new Set(['ALL_IN', 'ANY_IN', 'IN', 'NOT_IN']);
const operatorsWithRangeValue = new Set(['BETWEEN', 'NOT_BETWEEN']);
const operatorsWithSqlFieldReferenceValue = new Set([
  'EQUAL',
  'NOT_EQUAL',
  'LARGER',
  'LARGER_EQUAL',
  'SMALLER',
  'SMALLER_EQUAL',
  'LIKE',
  'NOT_LIKE',
]);

export const isSqlRuleFormattable = (rule: IDenormalizedRuleNode): boolean => {
  if (!rule.field || !rule.operator) {
    return false;
  }

  if (operatorsWithoutValue.has(rule.operator)) {
    return true;
  }

  if (isFieldComparisonRule(rule)) {
    return Boolean(
      rule.valueField && operatorsWithSqlFieldReferenceValue.has(rule.operator)
    );
  }

  if (typeof rule.value === 'undefined') {
    return false;
  }

  if (operatorsWithArrayValue.has(rule.operator)) {
    return Array.isArray(rule.value) || typeof rule.value === 'string' || typeof rule.value === 'number';
  }

  if (operatorsWithRangeValue.has(rule.operator)) {
    return Array.isArray(rule.value) && rule.value.length === 2;
  }

  return true;
};
