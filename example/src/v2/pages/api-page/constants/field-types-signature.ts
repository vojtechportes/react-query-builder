export const fieldTypesSignature = `export type BuilderFieldType =
  | 'BOOLEAN'
  | 'TEXT'
  | 'DATE'
  | 'NUMBER'
  | 'STATEMENT'
  | 'LIST'
  | 'MULTI_LIST'
  | 'GROUP';

export type IBuilderFieldProps =
  | IBooleanFieldProps
  | ITextFieldProps
  | IDateFieldProps
  | INumberFieldProps
  | IStatementFieldProps
  | IListFieldProps
  | IMultiListFieldProps
  | IGroupFieldProps;`;
