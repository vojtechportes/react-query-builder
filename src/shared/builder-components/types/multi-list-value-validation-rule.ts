import type { IBuilderFieldValidationBase } from './builder-field-validation-base';

export interface IMultiListValueValidationRule extends IBuilderFieldValidationBase<
  Array<string | number>
> {
  minItems?: number;
  maxItems?: number;
}
