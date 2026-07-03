import type {
  IDenormalizedRuleNode,
  QueryOperator,
  QueryRuleValue,
} from '../../utils/query-tree';
import { isFieldComparisonRule } from '../../utils/rule-value-source';
import { formatRsqlValue } from './shared';

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

const ensureRsqlSupportsRule = (rule: IDenormalizedRuleNode): void => {
  if (isFieldComparisonRule(rule)) {
    throw new Error(
      `RSQL does not support field-to-field comparisons for field "${rule.field}" and operator "${rule.operator}".`
    );
  }
};

const joinComparisons = (
  field: string,
  operator: string,
  values: string[] | number[],
  combinator: ';' | ','
): string => {
  if (values.length === 1) {
    return `${field}${operator}${formatRsqlValue(values[0])}`;
  }

  return `(${values
    .map(value => `${field}${operator}${formatRsqlValue(value)}`)
    .join(combinator)})`;
};

export const formatRsqlRule = (rule: IDenormalizedRuleNode): string => {
  ensureRsqlSupportsRule(rule);

  switch (rule.operator) {
    case 'EQUAL':
      return `${rule.field}==${formatRsqlValue(rule.value as never)}`;
    case 'NOT_EQUAL':
      return `${rule.field}!=${formatRsqlValue(rule.value as never)}`;
    case 'LARGER':
      return `${rule.field}=gt=${formatRsqlValue(rule.value as never)}`;
    case 'LARGER_EQUAL':
      return `${rule.field}=ge=${formatRsqlValue(rule.value as never)}`;
    case 'SMALLER':
      return `${rule.field}=lt=${formatRsqlValue(rule.value as never)}`;
    case 'SMALLER_EQUAL':
      return `${rule.field}=le=${formatRsqlValue(rule.value as never)}`;
    case 'IN':
      return `${rule.field}=in=(${ensureArrayValue(rule.operator, rule.value)
        .map(value => formatRsqlValue(value))
        .join(',')})`;
    case 'NOT_IN':
      return `${rule.field}=out=(${ensureArrayValue(rule.operator, rule.value)
        .map(value => formatRsqlValue(value))
        .join(',')})`;
    case 'ALL_IN':
      return joinComparisons(
        rule.field,
        '==',
        ensureArrayValue(rule.operator, rule.value),
        ';'
      );
    case 'ANY_IN':
      return joinComparisons(
        rule.field,
        '==',
        ensureArrayValue(rule.operator, rule.value),
        ','
      );
    case 'BETWEEN': {
      const [start, end] = ensureRangeValue(rule.operator, rule.value);
      return `(${rule.field}=ge=${formatRsqlValue(
        start
      )};${rule.field}=le=${formatRsqlValue(end)})`;
    }
    case 'NOT_BETWEEN': {
      const [start, end] = ensureRangeValue(rule.operator, rule.value);
      return `(${rule.field}=lt=${formatRsqlValue(
        start
      )},${rule.field}=gt=${formatRsqlValue(end)})`;
    }
    case 'IS_NULL':
      return `${rule.field}==null`;
    case 'IS_NOT_NULL':
      return `${rule.field}!=null`;
    case 'CONTAINS':
      return `${rule.field}==${formatRsqlValue(
        `*${ensureStringValue(rule.operator, rule.value)}*`
      )}`;
    case 'NOT_CONTAINS':
      return `${rule.field}!=${formatRsqlValue(
        `*${ensureStringValue(rule.operator, rule.value)}*`
      )}`;
    case 'STARTS_WITH':
      return `${rule.field}==${formatRsqlValue(
        `${ensureStringValue(rule.operator, rule.value)}*`
      )}`;
    case 'ENDS_WITH':
      return `${rule.field}==${formatRsqlValue(
        `*${ensureStringValue(rule.operator, rule.value)}`
      )}`;
    case 'LIKE':
      return `${rule.field}==${formatRsqlValue(
        ensureStringValue(rule.operator, rule.value)
      )}`;
    case 'NOT_LIKE':
      return `${rule.field}!=${formatRsqlValue(
        ensureStringValue(rule.operator, rule.value)
      )}`;
    default:
      throw new Error(
        `Unsupported or missing operator "${rule.operator}" for field "${rule.field}".`
      );
  }
};
