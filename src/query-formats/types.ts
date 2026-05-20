import type { IBuilderFieldProps } from '../builder';
import type { DenormalizedQuery, QueryGroupValue } from '../utils/query-tree';

export type QueryFormat =
  | 'SQL'
  | 'Mongo'
  | 'AQL'
  | 'JSONata'
  | 'JsonLogic'
  | 'CEL'
  | 'Elasticsearch'
  | 'SpEL'
  | 'Prisma'
  | 'OData'
  | 'RSQL'
  | 'Dynamo'
  | 'Django';

export interface IFormatQueryBaseOptions {
  rootlessCombinator?: QueryGroupValue;
  modifierlessGroupCombinator?: QueryGroupValue;
  fields?: IBuilderFieldProps[];
}

export interface IFormatSqlOptions extends IFormatQueryBaseOptions {
  wrapWhereClause?: boolean;
}

export interface IFormatMongoOptions extends IFormatQueryBaseOptions {}

export interface IFormatAqlOptions extends IFormatQueryBaseOptions {
  wrapFilterClause?: boolean;
  variableName?: string;
}

export interface IFormatJsonataOptions extends IFormatQueryBaseOptions {}

export interface IFormatJsonLogicOptions extends IFormatQueryBaseOptions {}

export interface IFormatCelOptions extends IFormatQueryBaseOptions {}

export interface IFormatElasticsearchOptions extends IFormatQueryBaseOptions {
  wrapQueryClause?: boolean;
}

export interface IFormatSpelOptions extends IFormatQueryBaseOptions {}

export interface IFormatPrismaOptions extends IFormatQueryBaseOptions {
  wrapWhereClause?: boolean;
}

export interface IFormatODataOptions extends IFormatQueryBaseOptions {
  wrapFilterClause?: boolean;
}

export interface IFormatRsqlOptions extends IFormatQueryBaseOptions {}

export interface IFormatDynamoOptions extends IFormatQueryBaseOptions {}

export interface IFormatDjangoOptions extends IFormatQueryBaseOptions {}

export interface IParseQueryResult {
  fields: IBuilderFieldProps[];
  data: DenormalizedQuery;
}

export type QueryFormatter<TOptions = unknown> = (
  value: DenormalizedQuery,
  options?: TOptions
) => string;

export type QueryParser = (value: string) => IParseQueryResult;
