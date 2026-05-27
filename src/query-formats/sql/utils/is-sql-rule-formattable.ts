import type { IDenormalizedRuleNode } from '../../../utils/query-tree';

const operatorsWithoutValue = new Set(['IS_NULL', 'IS_NOT_NULL']);
const operatorsWithArrayValue = new Set(['ALL_IN', 'ANY_IN', 'IN', 'NOT_IN']);
const operatorsWithRangeValue = new Set(['BETWEEN', 'NOT_BETWEEN']);

export const isSqlRuleFormattable = (rule: IDenormalizedRuleNode): boolean => {
  if (!rule.field || !rule.operator) {
    return false;
  }

  if (operatorsWithoutValue.has(rule.operator)) {
    return true;
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
