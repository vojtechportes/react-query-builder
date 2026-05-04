import {
  IBuilderFieldValidationBase,
  IBuilderValidationContext,
  IBuilderValidationIssue,
  IBuilderValidationMessageContext,
} from '../../builder';
import { isPromiseLike } from '../is-promise-like.util';
import { createCustomValidationIssue } from './create-custom-validation-issue.util';
import { getValidationString } from './get-validation-string.util';

export const validateBuilderBaseValue = <TValue>(
  value: TValue,
  validation: Partial<IBuilderFieldValidationBase<TValue>>,
  baseIssue: Omit<IBuilderValidationIssue, 'message'>,
  context: IBuilderValidationMessageContext,
  validationContext: IBuilderValidationContext
): IBuilderValidationIssue[] | Promise<IBuilderValidationIssue[]> => {
  const issues: IBuilderValidationIssue[] = [];

  if (
    validation.oneOf?.length &&
    !validation.oneOf.some((allowedValue) => allowedValue === value)
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

  if (!validation.custom) {
    return issues;
  }

  const customValidationResult = validation.custom(value, context);

  if (isPromiseLike(customValidationResult)) {
    return customValidationResult.then((customValidationPassed) => {
      if (customValidationPassed) {
        return issues;
      }

      return [
        ...issues,
        createCustomValidationIssue(
          baseIssue,
          context,
          validation.customMessage,
          validationContext
        ),
      ];
    });
  }

  if (!customValidationResult) {
    issues.push(
      createCustomValidationIssue(
        baseIssue,
        context,
        validation.customMessage,
        validationContext
      )
    );
  }

  return issues;
};
