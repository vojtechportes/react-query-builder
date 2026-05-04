import {
  IBuilderValidationContext,
  IBuilderValidationIssue,
  IBuilderValidationMessageContext,
  IListValueValidationRule,
} from '../../builder';
import { getValidationString } from './get-validation-string.util';
import { isPromiseLike } from '../is-promise-like.util';
import { validateBuilderBaseValue } from './validate-builder-base-value.util';

export const validateListValue = (
  value: string | number,
  validation: Partial<IListValueValidationRule>,
  allowedValues: Array<string | number>,
  baseIssue: Omit<IBuilderValidationIssue, 'message'>,
  context: IBuilderValidationMessageContext,
  validationContext: IBuilderValidationContext
): IBuilderValidationIssue[] | Promise<IBuilderValidationIssue[]> => {
  const issues: IBuilderValidationIssue[] = [];
  const restrictedValues = validation.oneOf?.length
    ? validation.oneOf
    : allowedValues;

  if (
    restrictedValues.length > 0 &&
    !restrictedValues.some((allowedValue) => allowedValue === value)
  ) {
    issues.push({
      ...baseIssue,
      code: 'one_of',
      message: getValidationString(
        validationContext.strings.validation,
        'oneOf',
        'Value must be one of the allowed options'
      ),
    });
  }

  const baseIssues = validateBuilderBaseValue(
    value,
    { ...validation, oneOf: undefined },
    baseIssue,
    context,
    validationContext
  );

  if (isPromiseLike(baseIssues)) {
    return baseIssues.then((resolvedBaseIssues) => [...issues, ...resolvedBaseIssues]);
  }

  return [...issues, ...baseIssues];
};
