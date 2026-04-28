import { IBuilderFieldProps } from '../builder';
import { isOptionList } from './is-option-list.util';

const getDefaultValueForTextLikeField = (field: IBuilderFieldProps) =>
  field.operators && ['BETWEEN', 'NOT_BETWEEN'].includes(field.operators[0])
    ? ['', '']
    : '';

const getDefaultValueForNumberField = (field: IBuilderFieldProps) =>
  field.operators && ['BETWEEN', 'NOT_BETWEEN'].includes(field.operators[0])
    ? ['0', '0']
    : '0';

export const createRuleStateForField = (field: IBuilderFieldProps) => {
  const baseRuleState = {
    field: field.field,
    operator: field.operators && field.operators[0],
    operators: field.operators,
  };

  switch (field.type) {
    case 'BOOLEAN':
      return {
        field: field.field,
        value: false,
      };

    case 'DATE':
    case 'TEXT':
      return {
        ...baseRuleState,
        value: getDefaultValueForTextLikeField(field),
      };

    case 'NUMBER':
      return {
        ...baseRuleState,
        value: getDefaultValueForNumberField(field),
      };

    case 'LIST':
      return {
        ...baseRuleState,
        value: isOptionList(field.value) ? field.value[0].value : undefined,
      };

    case 'MULTI_LIST':
      return {
        ...baseRuleState,
        value: isOptionList(field.value) ? [] : undefined,
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
