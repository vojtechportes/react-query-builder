import {
  BuilderFieldComparisonType,
  IBuilderFieldProps,
} from '../builder';
import { QueryOperator } from './query-tree';
import { isRangeOperator } from './is-range-operator.util';
import { operatorRequiresValue } from './operator-requires-value.util';

const fieldComparisonUnsupportedOperators = new Set<QueryOperator>([
  'ALL_IN',
  'ANY_IN',
  'IN',
  'NOT_IN',
  'BETWEEN',
  'NOT_BETWEEN',
]);

const inferListFieldComparisonType = (
  field: IBuilderFieldProps
): BuilderFieldComparisonType | undefined => {
  if (
    field.type !== 'LIST' ||
    !Array.isArray(field.value) ||
    field.value.length === 0 ||
    !field.value.every(
      option =>
        typeof option === 'object' &&
        option !== null &&
        typeof option.label === 'string' &&
        (typeof option.value === 'string' || typeof option.value === 'number')
    )
  ) {
    return undefined;
  }

  const optionValues = field.value.map(option => option.value);
  const allStrings = optionValues.every(value => typeof value === 'string');
  const allNumbers = optionValues.every(value => typeof value === 'number');

  if (allStrings) {
    return 'string';
  }

  if (allNumbers) {
    return 'number';
  }

  return undefined;
};

export const resolveFieldComparisonType = (
  field: IBuilderFieldProps
): BuilderFieldComparisonType | undefined => {
  if (field.fieldComparison?.type) {
    return field.fieldComparison.type;
  }

  switch (field.type) {
    case 'TEXT':
      return 'string';
    case 'NUMBER':
      return 'number';
    case 'DATE':
      return 'date';
    case 'BOOLEAN':
      return 'boolean';
    case 'LIST':
      return inferListFieldComparisonType(field);
    default:
      return undefined;
  }
};

export const supportsFieldComparisonForOperator = (
  field: IBuilderFieldProps,
  operator?: QueryOperator
): boolean => {
  if (!resolveFieldComparisonType(field)) {
    return false;
  }

  if (!operatorRequiresValue(operator)) {
    return false;
  }

  if (isRangeOperator(operator)) {
    return false;
  }

  return !fieldComparisonUnsupportedOperators.has(operator as QueryOperator);
};

export const areFieldsCompatibleForComparison = (
  sourceField: IBuilderFieldProps,
  candidateField: IBuilderFieldProps
): boolean => {
  const sourceComparisonType = resolveFieldComparisonType(sourceField);
  const candidateComparisonType = resolveFieldComparisonType(candidateField);

  if (!sourceComparisonType || !candidateComparisonType) {
    return false;
  }

  if (sourceField.field === candidateField.field) {
    return false;
  }

  if (sourceComparisonType !== candidateComparisonType) {
    return false;
  }

  if (
    sourceField.fieldComparison?.comparableFields &&
    !sourceField.fieldComparison.comparableFields.includes(candidateField.field)
  ) {
    return false;
  }

  return true;
};

export const getCompatibleValueFields = (
  fields: IBuilderFieldProps[],
  sourceField: IBuilderFieldProps,
  operator?: QueryOperator
): IBuilderFieldProps[] => {
  if (!supportsFieldComparisonForOperator(sourceField, operator)) {
    return [];
  }

  return fields.filter(candidate =>
    areFieldsCompatibleForComparison(sourceField, candidate)
  );
};
