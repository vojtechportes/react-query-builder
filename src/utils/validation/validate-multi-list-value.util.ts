import {
  IBuilderValidationContext,
  IBuilderValidationIssue,
  IBuilderValidationMessageContext,
  IMultiListValueValidationRule,
} from '../../builder';
import { getValidationString } from './get-validation-string.util';
import { isPromiseLike } from '../is-promise-like.util';
import { validateBuilderBaseValue } from './validate-builder-base-value.util';

export const validateMultiListValue = (
  value: Array<string | number>,
  validation: Partial<IMultiListValueValidationRule>,
  allowedValues: Array<string | number>,
  baseIssue: Omit<IBuilderValidationIssue, 'message'>,
  context: IBuilderValidationMessageContext,
  validationContext: IBuilderValidationContext
): IBuilderValidationIssue[] | Promise<IBuilderValidationIssue[]> => {
  const issues: IBuilderValidationIssue[] = [];

  if (
    typeof validation.minItems === 'number' &&
    value.length < validation.minItems
  ) {
    issues.push({
      ...baseIssue,
      code: 'min_items',
      message: getValidationString(
        validationContext.strings.validation,
        'minItems',
        `Select at least ${validation.minItems} values`,
        { min: validation.minItems }
      ),
    });
  }

  if (
    typeof validation.maxItems === 'number' &&
    value.length > validation.maxItems
  ) {
    issues.push({
      ...baseIssue,
      code: 'max_items',
      message: getValidationString(
        validationContext.strings.validation,
        'maxItems',
        `Select at most ${validation.maxItems} values`,
        { max: validation.maxItems }
      ),
    });
  }

  const restrictedValues = validation.oneOf?.length
    ? validation.oneOf
    : allowedValues;

  if (
    restrictedValues.length > 0 &&
    value.some(
      (selectedValue) =>
        !restrictedValues.some((allowedValue) => allowedValue === selectedValue)
    )
  ) {
    issues.push({
      ...baseIssue,
      code: 'one_of',
      message: getValidationString(
        validationContext.strings.validation,
        'oneOf',
        'All selected values must be allowed'
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
