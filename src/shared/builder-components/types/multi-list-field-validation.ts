import type { IBuilderValidationConfig } from './builder-validation-config';
import type { IMultiListFieldValidationRule } from './multi-list-field-validation-rule';

export type IMultiListFieldValidation =
  | Partial<IMultiListFieldValidationRule>
  | IBuilderValidationConfig<IMultiListFieldValidationRule>;
