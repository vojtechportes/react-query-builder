import type { IBuilderFieldValidationBase } from './builder-field-validation-base';

export interface INumberValueValidationRule extends IBuilderFieldValidationBase<
  number | number[]
> {
  min?: number;
  max?: number;
  integer?: boolean;
  positive?: boolean;
  negative?: boolean;
}
