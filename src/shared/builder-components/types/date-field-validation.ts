import type { IBuilderValidationConfig } from './builder-validation-config';
import type { IDateFieldValidationRule } from './date-field-validation-rule';

export type IDateFieldValidation =
  | Partial<IDateFieldValidationRule>
  | IBuilderValidationConfig<IDateFieldValidationRule>;
