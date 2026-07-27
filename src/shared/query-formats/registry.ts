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
  QueryFormatter,
  QueryParser,
} from './types';
import { formatAql } from './aql/format-aql';
import { parseAql } from './aql/parse-aql';
import { formatCel } from './cel/format-cel';
import { parseCel } from './cel/parse-cel';
import { formatDjango } from './django/format-django';
import { parseDjango } from './django/parse-django';
import { formatDynamo } from './dynamo/format-dynamo';
import { parseDynamo } from './dynamo/parse-dynamo';
import { formatElasticsearch } from './elasticsearch/format-elasticsearch';
import { parseElasticsearch } from './elasticsearch/parse-elasticsearch';
import { formatJsonLogic } from './json-logic/format-json-logic';
import { parseJsonLogic } from './json-logic/parse-json-logic';
import { formatJsonata } from './jsonata/format-jsonata';
import { parseJsonata } from './jsonata/parse-jsonata';
import { formatMongo } from './mongo/format-mongo';
import { parseMongo } from './mongo/parse-mongo';
import { formatOData } from './odata/format-odata';
import { parseOData } from './odata/parse-odata';
import { formatPrisma } from './prisma/format-prisma';
import { parsePrisma } from './prisma/parse-prisma';
import { formatRsql } from './rsql/format-rsql';
import { parseRsql } from './rsql/parse-rsql';
import { formatSpel } from './spel/format-spel';
import { parseSpel } from './spel/parse-spel';
import { formatSql } from './sql/format-sql';
import { parseSql } from './sql/parse-sql';

export const formatters: Record<
  QueryFormat,
  QueryFormatter<
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
  >
> = {
  SQL: formatSql,
  Mongo: formatMongo,
  AQL: formatAql,
  JSONata: formatJsonata,
  JsonLogic: formatJsonLogic,
  CEL: formatCel,
  Django: formatDjango,
  Dynamo: formatDynamo,
  Elasticsearch: formatElasticsearch,
  SpEL: formatSpel,
  Prisma: formatPrisma,
  OData: formatOData,
  RSQL: formatRsql,
};

export const parsers: Record<QueryFormat, QueryParser> = {
  SQL: parseSql,
  Mongo: parseMongo,
  AQL: parseAql,
  JSONata: parseJsonata,
  JsonLogic: parseJsonLogic,
  CEL: parseCel,
  Django: parseDjango,
  Dynamo: parseDynamo,
  Elasticsearch: parseElasticsearch,
  SpEL: parseSpel,
  Prisma: parsePrisma,
  OData: parseOData,
  RSQL: parseRsql,
};
