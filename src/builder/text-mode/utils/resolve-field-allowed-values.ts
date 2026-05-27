import {
  IListFieldValidationRule,
  IMultiListFieldValidationRule,
  IBuilderFieldProps,
} from '../../types';
import { QueryOperator } from '../../../utils/query-tree';
import { resolveBuilderValidationRule } from '../../../utils/validation/resolve-builder-validation-rule.util';
import { collectFieldOptionValues } from './collect-field-option-values';

export const resolveFieldAllowedValues = (
  field: IBuilderFieldProps,
  operator: QueryOperator | undefined
): Array<string | number> => {
  if (field.type === 'LIST') {
    const validation = resolveBuilderValidationRule<IListFieldValidationRule>(
      field.validation,
      operator
    );

    return validation?.oneOf?.length
      ? (validation.oneOf as unknown as Array<string | number>)
      : collectFieldOptionValues(field);
  }

  if (field.type === 'MULTI_LIST') {
    const validation = resolveBuilderValidationRule<IMultiListFieldValidationRule>(
      field.validation,
      operator
    );

    return validation?.oneOf?.length
      ? (validation.oneOf as unknown as Array<string | number>)
      : collectFieldOptionValues(field);
  }

  return [];
};
