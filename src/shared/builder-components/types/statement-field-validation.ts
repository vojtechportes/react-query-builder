import type { IBuilderValidationConfig } from './builder-validation-config';
import type { IStatementFieldValidationRule } from './statement-field-validation-rule';

export type IStatementFieldValidation =
  | Partial<IStatementFieldValidationRule>
  | IBuilderValidationConfig<IStatementFieldValidationRule>;
