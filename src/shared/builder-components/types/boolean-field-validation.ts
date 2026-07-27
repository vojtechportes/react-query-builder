import type { IBuilderValidationConfig } from './builder-validation-config';
import type { IBooleanFieldValidationRule } from './boolean-field-validation-rule';

export type IBooleanFieldValidation =
  | Partial<IBooleanFieldValidationRule>
  | IBuilderValidationConfig<IBooleanFieldValidationRule>;
