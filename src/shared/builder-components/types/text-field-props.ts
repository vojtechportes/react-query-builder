import type { ITextFieldValidation } from './text-field-validation';
import type { IBuilderFieldBase } from './builder-field-base';

export type ITextFieldProps = IBuilderFieldBase<
  'TEXT',
  string,
  ITextFieldValidation
>;
