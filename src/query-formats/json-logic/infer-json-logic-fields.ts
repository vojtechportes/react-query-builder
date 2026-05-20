import type { IBuilderFieldProps } from '../../builder';
import type {
  DenormalizedQuery,
  IDenormalizedRuleNode,
  QueryOperator,
} from '../../utils/query-tree';

const operatorOrder: QueryOperator[] = [
  'EQUAL',
  'NOT_EQUAL',
  'LARGER',
  'LARGER_EQUAL',
  'SMALLER',
  'SMALLER_EQUAL',
  'IN',
  'NOT_IN',
  'ALL_IN',
  'ANY_IN',
  'BETWEEN',
  'NOT_BETWEEN',
  'IS_NULL',
  'IS_NOT_NULL',
  'CONTAINS',
  'NOT_CONTAINS',
  'STARTS_WITH',
  'ENDS_WITH',
  'LIKE',
  'NOT_LIKE',
];

const collectRules = (data: DenormalizedQuery): IDenormalizedRuleNode[] =>
  data.flatMap(node => ('type' in node ? collectRules(node.children) : [node]));

const inferFieldType = (
  rule: IDenormalizedRuleNode
): IBuilderFieldProps['type'] => {
  if (rule.operator === 'IS_NULL' || rule.operator === 'IS_NOT_NULL') {
    return 'TEXT';
  }

  if (typeof rule.value === 'boolean') {
    return 'BOOLEAN';
  }

  if (typeof rule.value === 'number') {
    return 'NUMBER';
  }

  if (Array.isArray(rule.value) && rule.value.every(item => typeof item === 'number')) {
    return 'NUMBER';
  }

  return 'TEXT';
};

export const inferJsonLogicFields = (
  data: DenormalizedQuery
): IBuilderFieldProps[] => {
  const fieldMap = new Map<
    string,
    { type: IBuilderFieldProps['type']; operators: QueryOperator[] }
  >();

  collectRules(data).forEach(rule => {
    const current = fieldMap.get(rule.field);
    const nextType = inferFieldType(rule);

    if (!current) {
      fieldMap.set(rule.field, {
        type: nextType,
        operators: rule.operator ? [rule.operator] : [],
      });
      return;
    }

    if (current.type !== nextType) {
      current.type = 'TEXT';
    }

    if (rule.operator && !current.operators.includes(rule.operator)) {
      current.operators.push(rule.operator);
    }
  });

  return Array.from(fieldMap.entries()).map(([field, config]) => ({
    field,
    label: field,
    type: config.type,
    operators: operatorOrder.filter(operator =>
      config.operators.includes(operator)
    ),
  })) as IBuilderFieldProps[];
};

