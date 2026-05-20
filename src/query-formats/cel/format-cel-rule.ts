import type {
  IDenormalizedRuleNode,
  QueryOperator,
  QueryRuleValue,
} from '../../utils/query-tree';
import {
  escapeCelRegex,
  formatCelArrayValue,
  formatCelScalarValue,
  quoteCelString,
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

export const formatCelRule = (rule: IDenormalizedRuleNode): string => {
  switch (rule.operator) {
    case 'EQUAL':
      return `${rule.field} == ${formatCelScalarValue(rule.value as never)}`;
    case 'NOT_EQUAL':
      return `${rule.field} != ${formatCelScalarValue(rule.value as never)}`;
    case 'LARGER':
      return `${rule.field} > ${formatCelScalarValue(rule.value as never)}`;
    case 'LARGER_EQUAL':
      return `${rule.field} >= ${formatCelScalarValue(rule.value as never)}`;
    case 'SMALLER':
      return `${rule.field} < ${formatCelScalarValue(rule.value as never)}`;
    case 'SMALLER_EQUAL':
      return `${rule.field} <= ${formatCelScalarValue(rule.value as never)}`;
    case 'IN':
      return `${rule.field} in ${formatCelArrayValue(
        ensureArrayValue(rule.operator, rule.value)
      )}`;
    case 'NOT_IN':
      return `!(${rule.field} in ${formatCelArrayValue(
        ensureArrayValue(rule.operator, rule.value)
      )})`;
    case 'ALL_IN':
      return `${formatCelArrayValue(
        ensureArrayValue(rule.operator, rule.value)
      )}.all(item, item in ${rule.field})`;
    case 'ANY_IN':
      return `${formatCelArrayValue(
        ensureArrayValue(rule.operator, rule.value)
      )}.exists(item, item in ${rule.field})`;
    case 'BETWEEN': {
      const [start, end] = ensureRangeValue(rule.operator, rule.value);
      return `(${rule.field} >= ${formatCelScalarValue(
        start
      )} && ${rule.field} <= ${formatCelScalarValue(end)})`;
    }
    case 'NOT_BETWEEN': {
      const [start, end] = ensureRangeValue(rule.operator, rule.value);
      return `(${rule.field} < ${formatCelScalarValue(
        start
      )} || ${rule.field} > ${formatCelScalarValue(end)})`;
    }
    case 'IS_NULL':
      return `${rule.field} == null`;
    case 'IS_NOT_NULL':
      return `${rule.field} != null`;
    case 'CONTAINS':
      return `${rule.field}.contains(${quoteCelString(
        ensureStringValue(rule.operator, rule.value)
      )})`;
    case 'NOT_CONTAINS':
      return `!(${rule.field}.contains(${quoteCelString(
        ensureStringValue(rule.operator, rule.value)
      )}))`;
    case 'STARTS_WITH':
      return `${rule.field}.startsWith(${quoteCelString(
        ensureStringValue(rule.operator, rule.value)
      )})`;
    case 'ENDS_WITH':
      return `${rule.field}.endsWith(${quoteCelString(
        ensureStringValue(rule.operator, rule.value)
      )})`;
    case 'LIKE':
      return `${rule.field}.matches(${quoteCelString(
        `^${escapeCelRegex(ensureStringValue(rule.operator, rule.value))}$`
      )})`;
    case 'NOT_LIKE':
      return `!(${rule.field}.matches(${quoteCelString(
        `^${escapeCelRegex(ensureStringValue(rule.operator, rule.value))}$`
      )}))`;
    default:
      throw new Error(
        `Unsupported or missing operator "${rule.operator}" for field "${rule.field}".`
      );
  }
};
