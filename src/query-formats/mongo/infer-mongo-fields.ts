import type { IBuilderFieldProps } from '../../builder';
import type {
  DenormalizedQuery,
  IDenormalizedRuleNode,
  QueryOperator,
} from '../../utils/query-tree';

const inferMongoFieldType = (
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

const mergeMongoFieldType = (
  currentType: IBuilderFieldProps['type'] | undefined,
  nextType: IBuilderFieldProps['type']
): IBuilderFieldProps['type'] => {
  if (!currentType || currentType === nextType) {
    return nextType;
  }

  if (currentType === 'TEXT' || nextType === 'TEXT') {
    return 'TEXT';
  }

  if (currentType === 'BOOLEAN' || nextType === 'BOOLEAN') {
    return 'TEXT';
  }

  return nextType;
};

const collectMongoRules = (data: DenormalizedQuery): IDenormalizedRuleNode[] =>
  data.flatMap(node => {
    if (!('type' in node)) {
      return [node];
    }

    return collectMongoRules(node.children);
  });

export const inferMongoFields = (data: DenormalizedQuery): IBuilderFieldProps[] => {
  const fieldMap = new Map<
    string,
    { type: IBuilderFieldProps['type']; operators: QueryOperator[] }
  >();

  collectMongoRules(data).forEach(rule => {
    const currentField = fieldMap.get(rule.field);
    const nextType = inferMongoFieldType(rule);

    if (!currentField) {
      fieldMap.set(rule.field, {
        type: nextType,
        operators: rule.operator ? [rule.operator] : [],
      });
      return;
    }

    currentField.type = mergeMongoFieldType(currentField.type, nextType);

    if (rule.operator && !currentField.operators.includes(rule.operator)) {
      currentField.operators.push(rule.operator);
    }
  });

  return Array.from(fieldMap.entries()).map(([field, config]) => ({
    field,
    label: field,
    type: config.type,
    operators: config.operators,
  })) as IBuilderFieldProps[];
};

