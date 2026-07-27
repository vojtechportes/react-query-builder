import type { IBuilderValidationConfig } from './builder-validation-config';
import type { INumberFieldValidationRule } from './number-field-validation-rule';

export type INumberFieldValidation =
  | Partial<INumberFieldValidationRule>
  | IBuilderValidationConfig<INumberFieldValidationRule>;
