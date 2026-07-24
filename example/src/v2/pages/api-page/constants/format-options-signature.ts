export const formatOptionsSignature = `export interface IFormatQueryBaseOptions {
  rootlessCombinator?: 'AND' | 'OR';
  modifierlessGroupCombinator?: 'AND' | 'OR';
  fields?: IBuilderFieldProps[];
}

export interface IFormatSqlOptions extends IFormatQueryBaseOptions {
  wrapWhereClause?: boolean;
}

export interface IFormatAqlOptions extends IFormatQueryBaseOptions {
  wrapFilterClause?: boolean;
  variableName?: string;
}

export interface IFormatElasticsearchOptions extends IFormatQueryBaseOptions {
  wrapQueryClause?: boolean;
}

export interface IFormatPrismaOptions extends IFormatQueryBaseOptions {
  wrapWhereClause?: boolean;
}

export interface IFormatODataOptions extends IFormatQueryBaseOptions {
  wrapFilterClause?: boolean;
}`;
