import {
  BuilderValidationMessage,
  IBuilderValidationMessageContext,
} from '../..';

export const getBuilderValidationMessage = (
  message: BuilderValidationMessage | undefined,
  fallbackMessage: string,
  context: IBuilderValidationMessageContext
): string => {
  if (!message) {
    return fallbackMessage;
  }

  return typeof message === 'function' ? message(context) : message;
};
