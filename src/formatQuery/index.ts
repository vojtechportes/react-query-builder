import { formatters } from '../query-formats/registry';
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
} from '../query-formats/types';
import type { DenormalizedQuery } from '../utils/query-tree';

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
} from '../query-formats/types';

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
