import type { INumberFieldValidation } from './number-field-validation';
import type { IBuilderFieldBase } from './builder-field-base';

export type INumberFieldProps = IBuilderFieldBase<
  'NUMBER',
  number,
  INumberFieldValidation
>;
