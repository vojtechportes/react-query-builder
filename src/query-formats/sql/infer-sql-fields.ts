import type { IBuilderFieldProps } from '../../builder';
import type {
  DenormalizedQuery,
  IDenormalizedRuleNode,
  QueryOperator,
} from '../../utils/query-tree';
import { isFieldComparisonRule } from '../../utils/rule-value-source';
import { isDateString } from './shared';
import { sqlOperatorOrder } from './sql-token.types';

const inferSqlFieldType = (
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

    if (
      rule.value.every(
        item => typeof item === 'string' && isDateString(item as string)
      )
    ) {
      return 'DATE';
    }

    return 'TEXT';
  }

  if (typeof rule.value === 'string' && isDateString(rule.value)) {
    return 'DATE';
  }

  return 'TEXT';
};

const collectSqlRules = (data: DenormalizedQuery): IDenormalizedRuleNode[] =>
  data.flatMap(node => {
    if (!('type' in node)) {
      return [node];
    }

    return collectSqlRules(node.children);
  });

const mergeSqlFieldType = (
  currentType: IBuilderFieldProps['type'] | undefined,
  nextType: IBuilderFieldProps['type']
): IBuilderFieldProps['type'] => {
  if (!currentType || currentType === nextType) {
    return nextType;
  }

  if (currentType === 'TEXT' || nextType === 'TEXT') {
    return 'TEXT';
  }

  if (currentType === 'NUMBER' && nextType === 'DATE') {
    return 'TEXT';
  }

  if (currentType === 'DATE' && nextType === 'NUMBER') {
    return 'TEXT';
  }

  if (currentType === 'BOOLEAN' || nextType === 'BOOLEAN') {
    return 'TEXT';
  }

  return nextType;
};

export const inferSqlFields = (data: DenormalizedQuery): IBuilderFieldProps[] => {
  const fieldMap = new Map<
    string,
    { type: IBuilderFieldProps['type']; operators: QueryOperator[] }
  >();

  const mergeFieldConfig = (
    fieldName: string,
    type: IBuilderFieldProps['type'],
    operator?: QueryOperator
  ) => {
    const currentField = fieldMap.get(fieldName);

    if (!currentField) {
      fieldMap.set(fieldName, {
        type,
        operators: operator ? [operator] : [],
      });
      return;
    }

    currentField.type = mergeSqlFieldType(currentField.type, type);

    if (operator && !currentField.operators.includes(operator)) {
      currentField.operators.push(operator);
    }
  };

  collectSqlRules(data).forEach(rule => {
    const nextType = inferSqlFieldType(rule);

    mergeFieldConfig(rule.field, nextType, rule.operator);

    if (isFieldComparisonRule(rule)) {
      mergeFieldConfig(rule.valueField, nextType, rule.operator);
    }
  });

  return Array.from(fieldMap.entries()).map(([field, config]) => ({
    field,
    label: field,
    type: config.type,
    operators: sqlOperatorOrder.filter(operator =>
      config.operators.includes(operator)
    ),
  })) as IBuilderFieldProps[];
};

