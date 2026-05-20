import type {
  IDenormalizedRuleNode,
  QueryOperator,
  QueryRuleValue,
} from '../../utils/query-tree';
import {
  escapeJsonataRegex,
  formatJsonataArrayValue,
  formatJsonataScalarValue,
  quoteJsonataString,
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

const joinExpressions = (
  expressions: string[],
  combinator: 'and' | 'or'
): string => {
  if (expressions.length === 1) {
    return expressions[0];
  }

  return `(${expressions.join(` ${combinator} `)})`;
};

export const formatJsonataRule = (rule: IDenormalizedRuleNode): string => {
  switch (rule.operator) {
    case 'EQUAL':
      return `${rule.field} = ${formatJsonataScalarValue(rule.value as never)}`;
    case 'NOT_EQUAL':
      return `${rule.field} != ${formatJsonataScalarValue(rule.value as never)}`;
    case 'LARGER':
      return `${rule.field} > ${formatJsonataScalarValue(rule.value as never)}`;
    case 'LARGER_EQUAL':
      return `${rule.field} >= ${formatJsonataScalarValue(rule.value as never)}`;
    case 'SMALLER':
      return `${rule.field} < ${formatJsonataScalarValue(rule.value as never)}`;
    case 'SMALLER_EQUAL':
      return `${rule.field} <= ${formatJsonataScalarValue(rule.value as never)}`;
    case 'IN':
      return `${rule.field} in ${formatJsonataArrayValue(
        ensureArrayValue(rule.operator, rule.value)
      )}`;
    case 'NOT_IN':
      return `$not(${rule.field} in ${formatJsonataArrayValue(
        ensureArrayValue(rule.operator, rule.value)
      )})`;
    case 'ALL_IN':
      return joinExpressions(
        ensureArrayValue(rule.operator, rule.value).map(
          item => `${formatJsonataScalarValue(item)} in ${rule.field}`
        ),
        'and'
      );
    case 'ANY_IN':
      return joinExpressions(
        ensureArrayValue(rule.operator, rule.value).map(
          item => `${formatJsonataScalarValue(item)} in ${rule.field}`
        ),
        'or'
      );
    case 'BETWEEN': {
      const [start, end] = ensureRangeValue(rule.operator, rule.value);
      return `(${rule.field} >= ${formatJsonataScalarValue(
        start
      )} and ${rule.field} <= ${formatJsonataScalarValue(end)})`;
    }
    case 'NOT_BETWEEN': {
      const [start, end] = ensureRangeValue(rule.operator, rule.value);
      return `(${rule.field} < ${formatJsonataScalarValue(
        start
      )} or ${rule.field} > ${formatJsonataScalarValue(end)})`;
    }
    case 'IS_NULL':
      return `${rule.field} = null`;
    case 'IS_NOT_NULL':
      return `${rule.field} != null`;
    case 'CONTAINS':
      return `$contains(${rule.field}, ${quoteJsonataString(
        ensureStringValue(rule.operator, rule.value)
      )})`;
    case 'NOT_CONTAINS':
      return `$not($contains(${rule.field}, ${quoteJsonataString(
        ensureStringValue(rule.operator, rule.value)
      )}))`;
    case 'STARTS_WITH':
      return `$contains(${rule.field}, /^${escapeJsonataRegex(
        ensureStringValue(rule.operator, rule.value)
      )}/)`;
    case 'ENDS_WITH':
      return `$contains(${rule.field}, /${escapeJsonataRegex(
        ensureStringValue(rule.operator, rule.value)
      )}$/)`;
    case 'LIKE':
      return `$contains(${rule.field}, /^${escapeJsonataRegex(
        ensureStringValue(rule.operator, rule.value)
      )}$/)`;
    case 'NOT_LIKE':
      return `$not($contains(${rule.field}, /^${escapeJsonataRegex(
        ensureStringValue(rule.operator, rule.value)
      )}$/))`;
    default:
      throw new Error(
        `Unsupported or missing operator "${rule.operator}" for field "${rule.field}".`
      );
  }
};

