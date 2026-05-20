import type {
  IDenormalizedRuleNode,
  QueryOperator,
  QueryRuleValue,
} from '../../utils/query-tree';
import type { JsonLogicRule } from './shared';
import { createVarRule } from './shared';

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

const createNegatedRule = (rule: JsonLogicRule): JsonLogicRule => ({
  '!': rule,
});

export const formatJsonLogicRule = (
  rule: IDenormalizedRuleNode
): JsonLogicRule => {
  const field = createVarRule(rule.field);

  switch (rule.operator) {
    case 'EQUAL':
      return { '==': [field, rule.value as JsonLogicRule] };
    case 'NOT_EQUAL':
      return { '!=': [field, rule.value as JsonLogicRule] };
    case 'LARGER':
      return { '>': [field, rule.value as JsonLogicRule] };
    case 'LARGER_EQUAL':
      return { '>=': [field, rule.value as JsonLogicRule] };
    case 'SMALLER':
      return { '<': [field, rule.value as JsonLogicRule] };
    case 'SMALLER_EQUAL':
      return { '<=': [field, rule.value as JsonLogicRule] };
    case 'IN':
      return { in: [field, ensureArrayValue(rule.operator, rule.value)] };
    case 'NOT_IN':
      return createNegatedRule({
        in: [field, ensureArrayValue(rule.operator, rule.value)],
      });
    case 'ALL_IN':
      return {
        all: [
          ensureArrayValue(rule.operator, rule.value),
          { in: [{ var: '' }, field] },
        ],
      };
    case 'ANY_IN':
      return {
        some: [
          ensureArrayValue(rule.operator, rule.value),
          { in: [{ var: '' }, field] },
        ],
      };
    case 'BETWEEN': {
      const [start, end] = ensureRangeValue(rule.operator, rule.value);
      return { '<=': [start, field, end] };
    }
    case 'NOT_BETWEEN': {
      const [start, end] = ensureRangeValue(rule.operator, rule.value);
      return createNegatedRule({ '<=': [start, field, end] });
    }
    case 'IS_NULL':
      return { '==': [field, null] };
    case 'IS_NOT_NULL':
      return { '!=': [field, null] };
    case 'CONTAINS':
      return { in: [ensureStringValue(rule.operator, rule.value), field] };
    case 'NOT_CONTAINS':
      return createNegatedRule({
        in: [ensureStringValue(rule.operator, rule.value), field],
      });
    case 'STARTS_WITH': {
      const value = ensureStringValue(rule.operator, rule.value);
      return {
        '==': [{ substr: [field, 0, value.length] }, value],
      };
    }
    case 'ENDS_WITH': {
      const value = ensureStringValue(rule.operator, rule.value);
      return {
        '==': [{ substr: [field, -value.length] }, value],
      };
    }
    case 'LIKE':
      return { in: [ensureStringValue(rule.operator, rule.value), field] };
    case 'NOT_LIKE':
      return createNegatedRule({
        in: [ensureStringValue(rule.operator, rule.value), field],
      });
    default:
      throw new Error(
        `Unsupported or missing operator "${rule.operator}" for field "${rule.field}".`
      );
  }
};

