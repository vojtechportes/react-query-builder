import type { IBuilderFieldValidationBase } from './builder-field-validation-base';

export interface ITextValueValidationRule extends IBuilderFieldValidationBase<
  string | string[]
> {
  minLength?: number;
  maxLength?: number;
  matches?: RegExp;
}
