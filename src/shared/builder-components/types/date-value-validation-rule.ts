import type { IBuilderFieldValidationBase } from './builder-field-validation-base';

export interface IDateValueValidationRule extends IBuilderFieldValidationBase<
  string | string[]
> {
  minDate?: string | Date;
  maxDate?: string | Date;
}
