import {
  IBuilderRangeValidation,
  IBuilderValidationContext,
  IBuilderValidationIssue,
  IBuilderValidationMessageContext,
} from '../../builder';
import { getBuilderValidationMessage } from './get-builder-validation-message.util';
import { getValidationString } from './get-validation-string.util';
import { isPromiseLike } from '../is-promise-like.util';

const compareValues = (left: string | number, right: string | number) => {
  if (typeof left === 'number' && typeof right === 'number') {
    return left - right;
  }

  return String(left).localeCompare(String(right));
};

export const validateBuilderRange = <TValueValidation, TRangeValue extends string | number>(
  range: [TRangeValue, TRangeValue],
  validation:
    | IBuilderRangeValidation<TValueValidation, TRangeValue>
    | undefined,
  baseIssue: Omit<IBuilderValidationIssue, 'message'>,
  context: IBuilderValidationMessageContext,
  validationContext: IBuilderValidationContext
): IBuilderValidationIssue[] | Promise<IBuilderValidationIssue[]> => {
  if (!validation) {
    return [];
  }

  const issues: IBuilderValidationIssue[] = [];
  const [left, right] = range;
  const comparison = compareValues(left, right);

  if (validation.requireAscending) {
    const rangeIsValid = validation.allowEqual ? comparison <= 0 : comparison < 0;

    if (!rangeIsValid) {
      issues.push({
        ...baseIssue,
        code: 'range_order',
        message: getBuilderValidationMessage(
          validation.message,
          getValidationString(
            validationContext.strings.validation,
            validation.allowEqual ? 'rangeOrderAllowEqual' : 'rangeOrder',
            validation.allowEqual
              ? 'Range start must be less than or equal to range end'
              : 'Range start must be less than range end'
          ),
          context
        ),
      });
    }
  }

  if (!validation.validate) {
    return issues;
  }

  const validateResult = validation.validate(range, context);

  if (isPromiseLike(validateResult)) {
    return validateResult.then((isValid) => {
      if (isValid) {
        return issues;
      }

      return [
        ...issues,
        {
          ...baseIssue,
          code: 'range_custom',
          message: getBuilderValidationMessage(
            validation.message,
            getValidationString(
              validationContext.strings.validation,
              'rangeCustom',
              'Range is invalid'
            ),
            context
          ),
        },
      ];
    });
  }

  if (!validateResult) {
    issues.push({
      ...baseIssue,
      code: 'range_custom',
      message: getBuilderValidationMessage(
        validation.message,
        getValidationString(
          validationContext.strings.validation,
          'rangeCustom',
          'Range is invalid'
        ),
        context
      ),
    });
  }

  return issues;
};
