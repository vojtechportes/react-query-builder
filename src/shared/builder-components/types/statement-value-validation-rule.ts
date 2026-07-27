import type { IBuilderFieldValidationBase } from './builder-field-validation-base';

export type IStatementValueValidationRule =
  IBuilderFieldValidationBase<string> & {
    minLength?: number;
    maxLength?: number;
    matches?: RegExp;
  };
