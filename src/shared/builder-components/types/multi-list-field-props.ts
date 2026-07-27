import type { IMultiListFieldValidation } from './multi-list-field-validation';
import type { IBuilderFieldBase } from './builder-field-base';

export type IMultiListFieldProps = IBuilderFieldBase<
  'MULTI_LIST',
  Array<{ value: string | number; label: string }>,
  IMultiListFieldValidation
>;
