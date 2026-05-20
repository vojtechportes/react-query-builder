import type { IBuilderFieldProps } from '../../builder';
import type {
  DenormalizedQuery,
  IDenormalizedRuleNode,
  QueryOperator,
} from '../../utils/query-tree';

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

  collectPrismaRules(data).forEach(rule => {
    const current = fieldMap.get(rule.field);
    const nextType = inferPrismaFieldType(rule);

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
    operators: config.operators,
  })) as IBuilderFieldProps[];
};
