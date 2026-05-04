import {
  IBuilderValidationContext,
  IBuilderValidationIssue,
  IBuilderValidationMessageContext,
  INumberValueValidationRule,
} from '../../builder';
import { getValidationString } from './get-validation-string.util';
import { isPromiseLike } from '../is-promise-like.util';
import { validateBuilderBaseValue } from './validate-builder-base-value.util';

export const validateNumberValue = (
  value: number,
  validation: Partial<INumberValueValidationRule>,
  baseIssue: Omit<IBuilderValidationIssue, 'message'>,
  context: IBuilderValidationMessageContext,
  validationContext: IBuilderValidationContext
): IBuilderValidationIssue[] | Promise<IBuilderValidationIssue[]> => {
  const issues: IBuilderValidationIssue[] = [];

  if (typeof validation.min === 'number' && value < validation.min) {
    issues.push({
      ...baseIssue,
      code: 'min',
      message: getValidationString(
        validationContext.strings.validation,
        'min',
        `Value must be greater than or equal to ${validation.min}`,
        { min: validation.min }
      ),
    });
  }

  if (typeof validation.max === 'number' && value > validation.max) {
    issues.push({
      ...baseIssue,
      code: 'max',
      message: getValidationString(
        validationContext.strings.validation,
        'max',
        `Value must be less than or equal to ${validation.max}`,
        { max: validation.max }
      ),
    });
  }

  if (validation.integer && !Number.isInteger(value)) {
    issues.push({
      ...baseIssue,
      code: 'integer',
      message: getValidationString(
        validationContext.strings.validation,
        'integer',
        'Value must be an integer'
      ),
    });
  }

  if (validation.positive && value <= 0) {
    issues.push({
      ...baseIssue,
      code: 'positive',
      message: getValidationString(
        validationContext.strings.validation,
        'positive',
        'Value must be positive'
      ),
    });
  }

  if (validation.negative && value >= 0) {
    issues.push({
      ...baseIssue,
      code: 'negative',
      message: getValidationString(
        validationContext.strings.validation,
        'negative',
        'Value must be negative'
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
