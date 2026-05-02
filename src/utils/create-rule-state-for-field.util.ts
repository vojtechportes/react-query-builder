import { IBuilderFieldProps } from '../builder';
import { createRuleValueForFieldOperator } from './create-rule-value-for-field-operator.util';

export const createRuleStateForField = (field: IBuilderFieldProps) => {
  const nextOperator = field.operators && field.operators[0];
  const baseRuleState = {
    field: field.field,
    operator: nextOperator,
    operators: field.operators,
  };
  const nextValue = createRuleValueForFieldOperator(field, nextOperator);

  switch (field.type) {
    case 'BOOLEAN':
      return {
        ...baseRuleState,
        ...(typeof nextValue !== 'undefined' ? { value: nextValue } : {}),
      };

    case 'DATE':
    case 'TEXT':
    case 'NUMBER':
    case 'LIST':
    case 'MULTI_LIST':
      return {
        ...baseRuleState,
        ...(typeof nextValue !== 'undefined' ? { value: nextValue } : {}),
      };

    case 'STATEMENT':
      return {
        field: field.field,
        value: field.value,
      };

    default:
      return {
        field: field.field,
      };
  }
};
