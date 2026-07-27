import type { IBuilderValidationConfig } from './builder-validation-config';
import type { ITextFieldValidationRule } from './text-field-validation-rule';

export type ITextFieldValidation =
  | Partial<ITextFieldValidationRule>
  | IBuilderValidationConfig<ITextFieldValidationRule>;
