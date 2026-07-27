import type { IBooleanFieldValidation } from './boolean-field-validation';
import type { IBuilderFieldBase } from './builder-field-base';

export type IBooleanFieldProps = IBuilderFieldBase<
  'BOOLEAN',
  boolean,
  IBooleanFieldValidation
>;
