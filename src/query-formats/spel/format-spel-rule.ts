import type {
  IDenormalizedRuleNode,
  QueryOperator,
  QueryRuleValue,
} from '../../utils/query-tree';
import {
  escapeSpelRegex,
  formatSpelArrayValue,
  formatSpelScalarValue,
  quoteSpelString,
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

export const formatSpelRule = (rule: IDenormalizedRuleNode): string => {
  switch (rule.operator) {
    case 'EQUAL':
      return `${rule.field} == ${formatSpelScalarValue(rule.value as never)}`;
    case 'NOT_EQUAL':
      return `${rule.field} != ${formatSpelScalarValue(rule.value as never)}`;
    case 'LARGER':
      return `${rule.field} > ${formatSpelScalarValue(rule.value as never)}`;
    case 'LARGER_EQUAL':
      return `${rule.field} >= ${formatSpelScalarValue(rule.value as never)}`;
    case 'SMALLER':
      return `${rule.field} < ${formatSpelScalarValue(rule.value as never)}`;
    case 'SMALLER_EQUAL':
      return `${rule.field} <= ${formatSpelScalarValue(rule.value as never)}`;
    case 'IN':
      return `${formatSpelArrayValue(
        ensureArrayValue(rule.operator, rule.value)
      )}.contains(${rule.field})`;
    case 'NOT_IN':
      return `!(${formatSpelArrayValue(
        ensureArrayValue(rule.operator, rule.value)
      )}.contains(${rule.field}))`;
    case 'ALL_IN': {
      const items = ensureArrayValue(rule.operator, rule.value);
      return `(${formatSpelArrayValue(items)}.?[${rule.field}.contains(#this)].size() == ${
        items.length
      })`;
    }
    case 'ANY_IN':
      return `(${formatSpelArrayValue(
        ensureArrayValue(rule.operator, rule.value)
      )}.?[${rule.field}.contains(#this)].size() > 0)`;
    case 'BETWEEN': {
      const [start, end] = ensureRangeValue(rule.operator, rule.value);
      return `(${rule.field} >= ${formatSpelScalarValue(
        start
      )} and ${rule.field} <= ${formatSpelScalarValue(end)})`;
    }
    case 'NOT_BETWEEN': {
      const [start, end] = ensureRangeValue(rule.operator, rule.value);
      return `(${rule.field} < ${formatSpelScalarValue(
        start
      )} or ${rule.field} > ${formatSpelScalarValue(end)})`;
    }
    case 'IS_NULL':
      return `${rule.field} == null`;
    case 'IS_NOT_NULL':
      return `${rule.field} != null`;
    case 'CONTAINS':
      return `${rule.field}.contains(${quoteSpelString(
        ensureStringValue(rule.operator, rule.value)
      )})`;
    case 'NOT_CONTAINS':
      return `!(${rule.field}.contains(${quoteSpelString(
        ensureStringValue(rule.operator, rule.value)
      )}))`;
    case 'STARTS_WITH':
      return `${rule.field}.startsWith(${quoteSpelString(
        ensureStringValue(rule.operator, rule.value)
      )})`;
    case 'ENDS_WITH':
      return `${rule.field}.endsWith(${quoteSpelString(
        ensureStringValue(rule.operator, rule.value)
      )})`;
    case 'LIKE':
      return `${rule.field} matches ${quoteSpelString(
        `^${escapeSpelRegex(ensureStringValue(rule.operator, rule.value))}$`
      )}`;
    case 'NOT_LIKE':
      return `!(${rule.field} matches ${quoteSpelString(
        `^${escapeSpelRegex(ensureStringValue(rule.operator, rule.value))}$`
      )})`;
    default:
      throw new Error(
        `Unsupported or missing operator "${rule.operator}" for field "${rule.field}".`
      );
  }
};
