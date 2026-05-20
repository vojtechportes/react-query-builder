import type {
  DenormalizedNode,
  IDenormalizedRuleNode,
  QueryOperator,
} from '../../utils/query-tree';
import {
  isJsonLogicArray,
  isJsonLogicObject,
  isVarRule,
  type JsonLogicRule,
} from './shared';

const isSameVarRule = (value: unknown, field: string): boolean =>
  isVarRule(value) && value.var === field;

const asOperatorArray = (value: unknown): unknown[] => {
  if (isJsonLogicArray(value)) {
    return value;
  }

  return [value];
};

const parseMembershipArrayRule = (
  rule: JsonLogicRule
): IDenormalizedRuleNode | null => {
  if (!isJsonLogicObject(rule) || !('all' in rule || 'some' in rule)) {
    return null;
  }

  const operatorKey = 'all' in rule ? 'all' : 'some';
  const args = asOperatorArray(rule[operatorKey]);

  if (
    args.length !== 2 ||
    !isJsonLogicArray(args[0]) ||
    !isJsonLogicObject(args[1]) ||
    !('in' in args[1])
  ) {
    return null;
  }

  const membershipArgs = asOperatorArray(args[1].in);

  if (
    membershipArgs.length !== 2 ||
    !isSameVarRule(membershipArgs[0], '') ||
    !isVarRule(membershipArgs[1])
  ) {
    return null;
  }

  return {
    field: membershipArgs[1].var,
    operator: operatorKey === 'all' ? 'ALL_IN' : 'ANY_IN',
    value: args[0] as string[] | number[],
  };
};

const parseSubstrRule = (rule: JsonLogicRule): IDenormalizedRuleNode | null => {
  if (!isJsonLogicObject(rule) || !('==' in rule)) {
    return null;
  }

  const args = asOperatorArray(rule['==']);

  if (
    args.length !== 2 ||
    !isJsonLogicObject(args[0]) ||
    !('substr' in args[0]) ||
    typeof args[1] !== 'string'
  ) {
    return null;
  }

  const substrArgs = asOperatorArray(args[0].substr);

  if (
    substrArgs.length < 2 ||
    !isVarRule(substrArgs[0]) ||
    typeof substrArgs[1] !== 'number'
  ) {
    return null;
  }

  const field = substrArgs[0].var;
  const value = args[1];

  if (substrArgs[1] === 0) {
    return {
      field,
      operator: 'STARTS_WITH',
      value,
    };
  }

  if (substrArgs[1] < 0) {
    return {
      field,
      operator: 'ENDS_WITH',
      value,
    };
  }

  return null;
};

const parseSimpleRule = (rule: JsonLogicRule): IDenormalizedRuleNode | null => {
  if (!isJsonLogicObject(rule)) {
    return null;
  }

  const substrRule = parseSubstrRule(rule);

  if (substrRule) {
    return substrRule;
  }

  const membershipArrayRule = parseMembershipArrayRule(rule);

  if (membershipArrayRule) {
    return membershipArrayRule;
  }

  if ('==' in rule || '!=' in rule || '>' in rule || '>=' in rule || '<' in rule || '<=' in rule) {
    const operatorKey = ['==', '!=', '>', '>=', '<', '<='].find(key => key in rule);

    if (!operatorKey) {
      return null;
    }

    const args = asOperatorArray(rule[operatorKey]);

    if (
      operatorKey === '<=' &&
      args.length === 3 &&
      typeof args[0] !== 'object' &&
      isVarRule(args[1]) &&
      typeof args[2] !== 'object'
    ) {
      return {
        field: args[1].var,
        operator: 'BETWEEN',
        value: [args[0], args[2]] as string[] | number[],
      };
    }

    if (args.length !== 2 || !isVarRule(args[0])) {
      return null;
    }

    if (operatorKey === '==') {
      if (args[1] === null) {
        return { field: args[0].var, operator: 'IS_NULL' };
      }
      return { field: args[0].var, operator: 'EQUAL', value: args[1] as never };
    }

    if (operatorKey === '!=') {
      if (args[1] === null) {
        return { field: args[0].var, operator: 'IS_NOT_NULL' };
      }
      return {
        field: args[0].var,
        operator: 'NOT_EQUAL',
        value: args[1] as never,
      };
    }

    const operatorMap: Record<string, QueryOperator> = {
      '>': 'LARGER',
      '>=': 'LARGER_EQUAL',
      '<': 'SMALLER',
      '<=': 'SMALLER_EQUAL',
    };

    return {
      field: args[0].var,
      operator: operatorMap[operatorKey],
      value: args[1] as never,
    };
  }

  if ('in' in rule) {
    const args = asOperatorArray(rule.in);

    if (args.length !== 2) {
      return null;
    }

    if (isVarRule(args[0]) && isJsonLogicArray(args[1])) {
      return {
        field: args[0].var,
        operator: 'IN',
        value: args[1] as string[] | number[],
      };
    }

    if (typeof args[0] === 'string' && isVarRule(args[1])) {
      return {
        field: args[1].var,
        operator: 'CONTAINS',
        value: args[0],
      };
    }
  }

  return null;
};

const parseLogicalGroup = (
  combinator: 'AND' | 'OR',
  items: unknown[]
): DenormalizedNode[] => [
  {
    type: 'GROUP',
    value: combinator,
    isNegated: false,
    children: items.flatMap(item => parseJsonLogicExpression(item)),
  },
];

export const parseJsonLogicExpression = (value: unknown): DenormalizedNode[] => {
  const parsedSimpleRule = parseSimpleRule(value as JsonLogicRule);

  if (parsedSimpleRule) {
    return [parsedSimpleRule];
  }

  if (!isJsonLogicObject(value)) {
    throw new Error('JsonLogic rule must be a JSON object.');
  }

  if ('and' in value) {
    return parseLogicalGroup('AND', asOperatorArray(value.and));
  }

  if ('or' in value) {
    return parseLogicalGroup('OR', asOperatorArray(value.or));
  }

  if ('!' in value) {
    const childNodes = parseJsonLogicExpression(value['!']);

    if (childNodes.length === 1 && 'type' in childNodes[0]) {
      const child = childNodes[0];

    if (child.type === 'GROUP') {
      if ('value' in child && typeof child.value !== 'undefined') {
        return [
          {
            type: 'GROUP',
            value: child.value,
            isNegated: !child.isNegated,
            children: child.children,
          },
        ];
      }

        return [
          {
            type: 'GROUP',
            value: 'AND',
            isNegated: true,
            children: child.children,
          },
        ];
      }
    }

    const simpleNegatedRule = parseSimpleRule(value['!'] as JsonLogicRule);

    if (simpleNegatedRule) {
      if (simpleNegatedRule.operator === 'IN') {
        return [{ ...simpleNegatedRule, operator: 'NOT_IN' }];
      }

      if (simpleNegatedRule.operator === 'CONTAINS') {
        return [{ ...simpleNegatedRule, operator: 'NOT_CONTAINS' }];
      }

      if (simpleNegatedRule.operator === 'BETWEEN') {
        return [{ ...simpleNegatedRule, operator: 'NOT_BETWEEN' }];
      }

      if (simpleNegatedRule.operator === 'LIKE') {
        return [{ ...simpleNegatedRule, operator: 'NOT_LIKE' }];
      }
    }

    return [
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: true,
        children: childNodes,
      },
    ];
  }

  throw new Error('Unsupported JsonLogic rule structure.');
};
