import type { IBooleanFieldProps } from './boolean-field-props';
import type { ITextFieldProps } from './text-field-props';
import type { IDateFieldProps } from './date-field-props';
import type { INumberFieldProps } from './number-field-props';
import type { IStatementFieldProps } from './statement-field-props';
import type { IListFieldProps } from './list-field-props';
import type { IMultiListFieldProps } from './multi-list-field-props';
import type { IGroupFieldProps } from './group-field-props';

export type IBuilderFieldProps =
  | IBooleanFieldProps
  | ITextFieldProps
  | IDateFieldProps
  | INumberFieldProps
  | IStatementFieldProps
  | IListFieldProps
  | IMultiListFieldProps
  | IGroupFieldProps;
