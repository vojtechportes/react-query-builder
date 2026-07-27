import type { IBuilderValidationConfig } from './builder-validation-config';
import type { IListFieldValidationRule } from './list-field-validation-rule';

export type IListFieldValidation =
  | Partial<IListFieldValidationRule>
  | IBuilderValidationConfig<IListFieldValidationRule>;
