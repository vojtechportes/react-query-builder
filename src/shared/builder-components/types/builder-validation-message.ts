import type { IBuilderValidationMessageContext } from './builder-validation-message-context';

export type BuilderValidationMessage =
  | string
  | ((context: IBuilderValidationMessageContext) => string);
