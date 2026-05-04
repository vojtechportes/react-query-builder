import {
  IBuilderValidationContext,
  IBuilderValidationIssue,
  IBuilderValidationMessageContext,
  IDateValueValidationRule,
} from '../../builder';
import { getValidationString } from './get-validation-string.util';
import { isPromiseLike } from '../is-promise-like.util';
import { validateBuilderBaseValue } from './validate-builder-base-value.util';

const parseComparableDate = (value: string | Date) => {
  return value instanceof Date ? value.getTime() : new Date(value).getTime();
};

export const validateDateValue = (
  value: string,
  validation: Partial<IDateValueValidationRule>,
  baseIssue: Omit<IBuilderValidationIssue, 'message'>,
  context: IBuilderValidationMessageContext,
  validationContext: IBuilderValidationContext
): IBuilderValidationIssue[] | Promise<IBuilderValidationIssue[]> => {
  const issues: IBuilderValidationIssue[] = [];
  const comparableValue = parseComparableDate(value);

  if (
    validation.minDate &&
    comparableValue < parseComparableDate(validation.minDate)
  ) {
    issues.push({
      ...baseIssue,
      code: 'min_date',
      message: getValidationString(
        validationContext.strings.validation,
        'minDate',
        'Date is earlier than allowed'
      ),
    });
  }

  if (
    validation.maxDate &&
    comparableValue > parseComparableDate(validation.maxDate)
  ) {
    issues.push({
      ...baseIssue,
      code: 'max_date',
      message: getValidationString(
        validationContext.strings.validation,
        'maxDate',
        'Date is later than allowed'
      ),
    });
  }

  const baseIssues = validateBuilderBaseValue(
    value,
    validation,
    baseIssue,
    context,
    validationContext
  );

  if (isPromiseLike(baseIssues)) {
    return baseIssues.then((resolvedBaseIssues) => [...issues, ...resolvedBaseIssues]);
  }

  return [...issues, ...baseIssues];
};
