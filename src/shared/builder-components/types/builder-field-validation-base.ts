import type { IBuilderValidationMessageContext } from './builder-validation-message-context';
import type { BuilderValidationMessage } from './builder-validation-message';

export interface IBuilderFieldValidationBase<TValue = unknown> {
  required?: boolean;
  oneOf?: TValue[];
  custom?: (
    value: TValue,
    context: IBuilderValidationMessageContext
  ) => boolean | Promise<boolean>;
  customMessage?: BuilderValidationMessage;
}
