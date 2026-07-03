import { IBuilderFieldProps } from '../../builder';
import {
  areFieldsCompatibleForComparison,
  supportsFieldComparisonForOperator,
} from '../field-comparison-support';
import { QueryOperator } from '../query-operators';

export type FieldComparisonValidationCode =
  | 'field_comparison_disabled'
  | 'field_comparison_operator_not_allowed'
  | 'field_comparison_incompatible'
  | 'value_field_required'
  | 'value_field_not_found';

export interface IFieldComparisonValidationResult {
  code: FieldComparisonValidationCode;
  params: Record<string, string>;
}

interface IValidateFieldComparisonArgs {
  allowFieldComparisons: boolean;
  field: IBuilderFieldProps;
  fields: IBuilderFieldProps[];
  operator?: QueryOperator;
  valueField?: string;
}

export const validateFieldComparison = ({
  allowFieldComparisons,
  field,
  fields,
  operator,
  valueField,
}: IValidateFieldComparisonArgs): IFieldComparisonValidationResult | null => {
  if (!allowFieldComparisons) {
    return {
      code: 'field_comparison_disabled',
      params: {
        field: field.field,
        operator: operator || '',
      },
    };
  }

  if (!supportsFieldComparisonForOperator(field, operator)) {
    return {
      code: 'field_comparison_operator_not_allowed',
      params: {
        field: field.field,
        operator: operator || '',
      },
    };
  }

  if (!valueField) {
    return {
      code: 'value_field_required',
      params: {},
    };
  }

  const resolvedValueField = fields.find(fieldItem => fieldItem.field === valueField);

  if (!resolvedValueField) {
    return {
      code: 'value_field_not_found',
      params: {
        field: valueField,
      },
    };
  }

  if (!areFieldsCompatibleForComparison(field, resolvedValueField)) {
    return {
      code: 'field_comparison_incompatible',
      params: {
        field: field.field,
        valueField: resolvedValueField.field,
        operator: operator || '',
      },
    };
  }

  return null;
};
