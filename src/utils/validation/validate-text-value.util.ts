import {
  IBuilderValidationContext,
  IBuilderValidationIssue,
  IBuilderValidationMessageContext,
  ITextValueValidationRule,
} from '../../builder';
import { getValidationString } from './get-validation-string.util';
import { isPromiseLike } from '../is-promise-like.util';
import { validateBuilderBaseValue } from './validate-builder-base-value.util';

export const validateTextValue = (
  value: string,
  validation: Partial<ITextValueValidationRule>,
  baseIssue: Omit<IBuilderValidationIssue, 'message'>,
  context: IBuilderValidationMessageContext,
  validationContext: IBuilderValidationContext
): IBuilderValidationIssue[] | Promise<IBuilderValidationIssue[]> => {
  const issues: IBuilderValidationIssue[] = [];

  if (
    typeof validation.minLength === 'number' &&
    value.length < validation.minLength
  ) {
    issues.push({
      ...baseIssue,
      code: 'min_length',
      message: getValidationString(
        validationContext.strings.validation,
        'minLength',
        `Value must be at least ${validation.minLength} characters long`,
        { min: validation.minLength }
      ),
    });
  }

  if (
    typeof validation.maxLength === 'number' &&
    value.length > validation.maxLength
  ) {
    issues.push({
      ...baseIssue,
      code: 'max_length',
      message: getValidationString(
        validationContext.strings.validation,
        'maxLength',
        `Value must be at most ${validation.maxLength} characters long`,
        { max: validation.maxLength }
      ),
    });
  }

  if (validation.matches && !validation.matches.test(value)) {
    issues.push({
      ...baseIssue,
      code: 'matches',
      message: getValidationString(
        validationContext.strings.validation,
        'matches',
        'Value has invalid format'
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
