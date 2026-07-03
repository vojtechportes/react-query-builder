import type {
  IDenormalizedRuleNode,
  QueryOperator,
  QueryRuleValue,
} from '../../utils/query-tree';
import { isFieldComparisonRule } from '../../utils/rule-value-source';
import {
  formatDjangoFieldReference,
  formatDjangoScalarValue,
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

const formatFieldOrScalarValue = (rule: IDenormalizedRuleNode): string =>
  isFieldComparisonRule(rule)
    ? formatDjangoFieldReference(rule.valueField)
    : formatDjangoScalarValue(rule.value as never);

export const formatDjangoRule = (rule: IDenormalizedRuleNode): string => {
  switch (rule.operator) {
    case 'EQUAL':
      return `Q(${rule.field}=${formatFieldOrScalarValue(rule)})`;
    case 'NOT_EQUAL':
      return `~Q(${rule.field}=${formatFieldOrScalarValue(rule)})`;
    case 'LARGER':
      return `Q(${rule.field}__gt=${formatFieldOrScalarValue(rule)})`;
    case 'LARGER_EQUAL':
      return `Q(${rule.field}__gte=${formatFieldOrScalarValue(rule)})`;
    case 'SMALLER':
      return `Q(${rule.field}__lt=${formatFieldOrScalarValue(rule)})`;
    case 'SMALLER_EQUAL':
      return `Q(${rule.field}__lte=${formatFieldOrScalarValue(rule)})`;
    case 'IN':
    case 'ANY_IN':
      return `Q(${rule.field}__in=[${ensureArrayValue(rule.operator, rule.value)
        .map(value => formatDjangoScalarValue(value))
        .join(', ')}])`;
    case 'NOT_IN':
      return `~Q(${rule.field}__in=[${ensureArrayValue(rule.operator, rule.value)
        .map(value => formatDjangoScalarValue(value))
        .join(', ')}])`;
    case 'ALL_IN':
      return `(${ensureArrayValue(rule.operator, rule.value)
        .map(value => `Q(${rule.field}__contains=${formatDjangoScalarValue(value)})`)
        .join(' & ')})`;
    case 'BETWEEN': {
      const [start, end] = ensureRangeValue(rule.operator, rule.value);
      return `Q(${rule.field}__gte=${formatDjangoScalarValue(
        start
      )}, ${rule.field}__lte=${formatDjangoScalarValue(end)})`;
    }
    case 'NOT_BETWEEN': {
      const [start, end] = ensureRangeValue(rule.operator, rule.value);
      return `(Q(${rule.field}__lt=${formatDjangoScalarValue(
        start
      )}) | Q(${rule.field}__gt=${formatDjangoScalarValue(end)}))`;
    }
    case 'IS_NULL':
      return `Q(${rule.field}__isnull=True)`;
    case 'IS_NOT_NULL':
      return `Q(${rule.field}__isnull=False)`;
    case 'CONTAINS':
      return `Q(${rule.field}__contains=${formatFieldOrScalarValue(rule)})`;
    case 'NOT_CONTAINS':
      return `~Q(${rule.field}__contains=${formatFieldOrScalarValue(rule)})`;
    case 'STARTS_WITH':
      return `Q(${rule.field}__startswith=${formatFieldOrScalarValue(rule)})`;
    case 'ENDS_WITH':
      return `Q(${rule.field}__endswith=${formatFieldOrScalarValue(rule)})`;
    case 'LIKE':
      return `Q(${rule.field}__exact=${formatDjangoScalarValue(
        ensureStringValue(rule.operator, rule.value)
      )})`;
    case 'NOT_LIKE':
      return `~Q(${rule.field}__exact=${formatDjangoScalarValue(
        ensureStringValue(rule.operator, rule.value)
      )})`;
    default:
      throw new Error(
        `Unsupported or missing operator "${rule.operator}" for field "${rule.field}".`
      );
  }
};
