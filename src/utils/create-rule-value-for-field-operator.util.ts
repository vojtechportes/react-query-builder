import { IBuilderFieldProps } from '../builder';
import { operatorRequiresValue } from './operator-requires-value.util';
import { isOptionList } from './is-option-list.util';
import { isRangeOperator } from './is-range-operator.util';
import { isBoolean } from './is-boolean.util';
import { isNumber } from './is-number.util';
import { isString } from './is-string.util';
import { isStringArray } from './is-string-array.util';
import { QueryOperator, QueryRuleValue } from './query-tree';

export const createRuleValueForFieldOperator = (
  field: IBuilderFieldProps,
  operator?: QueryOperator
): QueryRuleValue | undefined => {
  if (!operatorRequiresValue(operator)) {
    return undefined;
  }

  switch (field.type) {
    case 'BOOLEAN':
      return false;
    case 'DATE':
    case 'TEXT':
      return isRangeOperator(operator) ? ['', ''] : '';
    case 'NUMBER':
      return isRangeOperator(operator) ? [0, 0] : 0;
    case 'LIST':
      return isOptionList(field.value) ? field.value[0].value : undefined;
    case 'MULTI_LIST':
      return isOptionList(field.value) ? [] : undefined;
    case 'STATEMENT':
      if (
        isString(field.value) ||
        isStringArray(field.value) ||
        isBoolean(field.value) ||
        isNumber(field.value)
      ) {
        return field.value;
      }

      return undefined;
    default:
      return undefined;
  }
};
