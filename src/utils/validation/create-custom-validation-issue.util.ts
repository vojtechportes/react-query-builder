import {
  IBuilderValidationContext,
  IBuilderValidationIssue,
  IBuilderValidationMessageContext,
} from '../../builder';
import { getBuilderValidationMessage } from './get-builder-validation-message.util';
import { getValidationString } from './get-validation-string.util';

export const createCustomValidationIssue = (
  baseIssue: Omit<IBuilderValidationIssue, 'message'>,
  context: IBuilderValidationMessageContext,
  customMessage: string | ((context: IBuilderValidationMessageContext) => string) | undefined,
  validationContext: IBuilderValidationContext
) => {
  return {
    ...baseIssue,
    code: 'custom',
    message: getBuilderValidationMessage(
      customMessage,
      getValidationString(
        validationContext.strings.validation,
        'custom',
        'Value is invalid'
      ),
      context
    ),
  };
};
