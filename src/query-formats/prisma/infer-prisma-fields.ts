import type { IBuilderFieldProps } from '../../builder';
import type {
  DenormalizedQuery,
  IDenormalizedRuleNode,
  QueryOperator,
} from '../../utils/query-tree';
import { isFieldComparisonRule } from '../../utils/rule-value-source';

const inferPrismaFieldType = (
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

  if (Array.isArray(rule.value)) {
    if (rule.value.every(item => typeof item === 'number')) {
      return 'NUMBER';
    }

    return 'TEXT';
  }

  return 'TEXT';
};

const collectPrismaRules = (data: DenormalizedQuery): IDenormalizedRuleNode[] =>
  data.flatMap(node => {
    if (!('type' in node)) {
      return [node];
    }

    return collectPrismaRules(node.children);
  });

export const inferPrismaFields = (data: DenormalizedQuery): IBuilderFieldProps[] => {
  const fieldMap = new Map<
    string,
    { type: IBuilderFieldProps['type']; operators: QueryOperator[] }
  >();

  const mergeFieldConfig = (
    fieldName: string,
    type: IBuilderFieldProps['type'],
    operator?: QueryOperator
  ) => {
    const current = fieldMap.get(fieldName);

    if (!current) {
      fieldMap.set(fieldName, {
        type,
        operators: operator ? [operator] : [],
      });
      return;
    }

    if (current.type !== type) {
      current.type = 'TEXT';
    }

    if (operator && !current.operators.includes(operator)) {
      current.operators.push(operator);
    }
  };

  collectPrismaRules(data).forEach(rule => {
    const nextType = inferPrismaFieldType(rule);
    mergeFieldConfig(rule.field, nextType, rule.operator);

    if (isFieldComparisonRule(rule)) {
      mergeFieldConfig(rule.valueField, nextType, rule.operator);
    }
  });

  return Array.from(fieldMap.entries()).map(([field, config]) => ({
    field,
    label: field,
    type: config.type,
    operators: config.operators,
  })) as IBuilderFieldProps[];
};
