import { formatters } from '../../shared/query-formats/registry';
import type {
  IFormatAqlOptions,
  IFormatCelOptions,
  IFormatDjangoOptions,
  IFormatDynamoOptions,
  IFormatElasticsearchOptions,
  IFormatJsonLogicOptions,
  IFormatJsonataOptions,
  IFormatMongoOptions,
  IFormatODataOptions,
  IFormatPrismaOptions,
  IFormatRsqlOptions,
  IFormatSpelOptions,
  IFormatSqlOptions,
  QueryFormat,
} from '../../shared/query-formats/types';
import type { DenormalizedQuery } from '../../shared/query/model/types/query-tree';

export type {
  IFormatAqlOptions,
  IFormatCelOptions,
  IFormatDjangoOptions,
  IFormatDynamoOptions,
  IFormatElasticsearchOptions,
  IFormatJsonLogicOptions,
  IFormatJsonataOptions,
  IFormatMongoOptions,
  IFormatODataOptions,
  IFormatPrismaOptions,
  IFormatQueryBaseOptions,
  IFormatRsqlOptions,
  IFormatSpelOptions,
  IFormatSqlOptions,
} from '../../shared/query-formats/types';

export const formatQuery = (
  value: DenormalizedQuery,
  format: QueryFormat,
  options?:
    | IFormatSqlOptions
    | IFormatMongoOptions
    | IFormatAqlOptions
    | IFormatJsonataOptions
    | IFormatJsonLogicOptions
    | IFormatCelOptions
    | IFormatDjangoOptions
    | IFormatDynamoOptions
    | IFormatElasticsearchOptions
    | IFormatSpelOptions
    | IFormatPrismaOptions
    | IFormatODataOptions
    | IFormatRsqlOptions
): string => formatters[format](value, options);
