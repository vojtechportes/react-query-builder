import type { IBuilderValidationMessageContext } from './builder-validation-message-context';
import type { BuilderValidationMessage } from './builder-validation-message';

export interface IBuilderRangeValidation<
  TValueValidation = unknown,
  TRangeValue = string | number,
> {
  common?: Partial<TValueValidation>;
  start?: Partial<TValueValidation>;
  end?: Partial<TValueValidation>;
  allowEqual?: boolean;
  requireAscending?: boolean;
  validate?: (
    range: [TRangeValue, TRangeValue],
    context: IBuilderValidationMessageContext
  ) => boolean | Promise<boolean>;
  message?: BuilderValidationMessage;
}
