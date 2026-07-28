import type { IBuilderFieldProps } from '../builder-components/types';
import type {
  DenormalizedQuery,
  QueryGroupValue,
} from '../query/model/types/query-tree';

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

// Kept as a named public extension point for declaration merging.
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IFormatMongoOptions extends IFormatQueryBaseOptions {}

export interface IFormatAqlOptions extends IFormatQueryBaseOptions {
  wrapFilterClause?: boolean;
  variableName?: string;
}

// Kept as a named public extension point for declaration merging.
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IFormatJsonataOptions extends IFormatQueryBaseOptions {}

// Kept as a named public extension point for declaration merging.
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IFormatJsonLogicOptions extends IFormatQueryBaseOptions {}

// Kept as a named public extension point for declaration merging.
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IFormatCelOptions extends IFormatQueryBaseOptions {}

export interface IFormatElasticsearchOptions extends IFormatQueryBaseOptions {
  wrapQueryClause?: boolean;
}

// Kept as a named public extension point for declaration merging.
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IFormatSpelOptions extends IFormatQueryBaseOptions {}

export interface IFormatPrismaOptions extends IFormatQueryBaseOptions {
  wrapWhereClause?: boolean;
}

export interface IFormatODataOptions extends IFormatQueryBaseOptions {
  wrapFilterClause?: boolean;
}

// Kept as a named public extension point for declaration merging.
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IFormatRsqlOptions extends IFormatQueryBaseOptions {}

// Kept as a named public extension point for declaration merging.
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IFormatDynamoOptions extends IFormatQueryBaseOptions {}

// Kept as a named public extension point for declaration merging.
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
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
