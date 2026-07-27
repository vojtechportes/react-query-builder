import type { IListFieldValidation } from './list-field-validation';
import type { IBuilderFieldBase } from './builder-field-base';

export type IListFieldProps = IBuilderFieldBase<
  'LIST',
  Array<{ value: string | number; label: string }>,
  IListFieldValidation
>;
