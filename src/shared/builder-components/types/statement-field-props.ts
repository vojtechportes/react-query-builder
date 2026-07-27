import type { IStatementFieldValidation } from './statement-field-validation';
import type { IBuilderFieldBase } from './builder-field-base';

export type IStatementFieldProps = IBuilderFieldBase<
  'STATEMENT',
  string,
  IStatementFieldValidation
>;
