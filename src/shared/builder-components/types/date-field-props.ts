import type { IDateFieldValidation } from './date-field-validation';
import type { IBuilderFieldBase } from './builder-field-base';

export type IDateFieldProps = IBuilderFieldBase<
  'DATE',
  string,
  IDateFieldValidation
>;
