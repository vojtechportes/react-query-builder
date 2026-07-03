import type {
  IDenormalizedRuleNode,
  QueryOperator,
  QueryRuleValue,
} from '../../utils/query-tree';
import { isFieldComparisonRule } from '../../utils/rule-value-source';
import { formatODataScalarValue } from './shared';

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

const formatFieldOrScalarValue = (rule: IDenormalizedRuleNode): string =>
  isFieldComparisonRule(rule)
    ? rule.valueField
    : formatODataScalarValue(rule.value as never);

const formatFieldOrStringValue = (rule: IDenormalizedRuleNode): string =>
  isFieldComparisonRule(rule)
    ? rule.valueField
    : formatODataScalarValue(ensureStringValue(rule.operator, rule.value));

export const formatODataRule = (rule: IDenormalizedRuleNode): string => {
  switch (rule.operator) {
    case 'EQUAL':
      return `${rule.field} eq ${formatFieldOrScalarValue(rule)}`;
    case 'NOT_EQUAL':
      return `${rule.field} ne ${formatFieldOrScalarValue(rule)}`;
    case 'LARGER':
      return `${rule.field} gt ${formatFieldOrScalarValue(rule)}`;
    case 'LARGER_EQUAL':
      return `${rule.field} ge ${formatFieldOrScalarValue(rule)}`;
    case 'SMALLER':
      return `${rule.field} lt ${formatFieldOrScalarValue(rule)}`;
    case 'SMALLER_EQUAL':
      return `${rule.field} le ${formatFieldOrScalarValue(rule)}`;
    case 'IN': {
      const values = ensureArrayValue(rule.operator, rule.value)
        .map(item => `${rule.field} eq ${formatODataScalarValue(item)}`);
      return values.length === 1 ? values[0] : `(${values.join(' or ')})`;
    }
    case 'NOT_IN': {
      const values = ensureArrayValue(rule.operator, rule.value)
        .map(item => `${rule.field} ne ${formatODataScalarValue(item)}`);
      return values.length === 1 ? values[0] : `(${values.join(' and ')})`;
    }
    case 'ALL_IN': {
      const values = ensureArrayValue(rule.operator, rule.value)
        .map(item => `contains(${rule.field},${formatODataScalarValue(item)})`);
      return values.length === 1 ? values[0] : `(${values.join(' and ')})`;
    }
    case 'ANY_IN': {
      const values = ensureArrayValue(rule.operator, rule.value)
        .map(item => `contains(${rule.field},${formatODataScalarValue(item)})`);
      return values.length === 1 ? values[0] : `(${values.join(' or ')})`;
    }
    case 'BETWEEN': {
      const [start, end] = ensureRangeValue(rule.operator, rule.value);
      return `(${rule.field} ge ${formatODataScalarValue(
        start
      )} and ${rule.field} le ${formatODataScalarValue(end)})`;
    }
    case 'NOT_BETWEEN': {
      const [start, end] = ensureRangeValue(rule.operator, rule.value);
      return `(${rule.field} lt ${formatODataScalarValue(
        start
      )} or ${rule.field} gt ${formatODataScalarValue(end)})`;
    }
    case 'IS_NULL':
      return `${rule.field} eq null`;
    case 'IS_NOT_NULL':
      return `${rule.field} ne null`;
    case 'CONTAINS':
      return `contains(${rule.field},${formatFieldOrStringValue(rule)})`;
    case 'NOT_CONTAINS':
      return `not contains(${rule.field},${formatFieldOrStringValue(rule)})`;
    case 'STARTS_WITH':
      return `startswith(${rule.field},${formatFieldOrStringValue(rule)})`;
    case 'ENDS_WITH':
      return `endswith(${rule.field},${formatFieldOrStringValue(rule)})`;
    case 'LIKE':
      return `${rule.field} eq ${formatODataScalarValue(
        ensureStringValue(rule.operator, rule.value)
      )}`;
    case 'NOT_LIKE':
      return `${rule.field} ne ${formatODataScalarValue(
        ensureStringValue(rule.operator, rule.value)
      )}`;
    default:
      throw new Error(
        `Unsupported or missing operator "${rule.operator}" for field "${rule.field}".`
      );
  }
};
