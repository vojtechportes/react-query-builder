import type {
  DenormalizedQuery,
  IBuilderFieldProps,
} from '@vojtechportes/react-query-builder';
import { formatQuery } from '../../../src/formatQuery';

export type SupportedQueryFormat =
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

export type OutputFormat = 'Native' | SupportedQueryFormat;

export const supportedFormats: SupportedQueryFormat[] = [
  'SQL',
  'Mongo',
  'AQL',
  'JSONata',
  'JsonLogic',
  'CEL',
  'Elasticsearch',
  'SpEL',
  'Prisma',
  'OData',
  'RSQL',
  'Dynamo',
  'Django',
];

export const formatLabels: Record<OutputFormat, string> = {
  Native: 'Native',
  SQL: 'SQL',
  Mongo: 'Mongo',
  AQL: 'AQL',
  JSONata: 'JSONata',
  JsonLogic: 'JsonLogic',
  CEL: 'CEL',
  Elasticsearch: 'Elasticsearch',
  SpEL: 'SpEL',
  Prisma: 'Prisma',
  OData: 'OData',
  RSQL: 'RSQL',
  Dynamo: 'Dynamo',
  Django: 'Django',
};

export const serializeNativeQuery = (query: DenormalizedQuery) =>
  JSON.stringify(query, null, 2);

export const formatQueryText = (
  query: DenormalizedQuery,
  format: SupportedQueryFormat,
  fields: IBuilderFieldProps[]
) => {
  switch (format) {
    case 'SQL':
      return formatQuery(query, format, { fields, wrapWhereClause: true });
    case 'AQL':
      return formatQuery(query, format, {
        fields,
        variableName: 'doc',
        wrapFilterClause: true,
      });
    case 'Elasticsearch':
      return formatQuery(query, format, { fields, wrapQueryClause: true });
    case 'Prisma':
      return formatQuery(query, format, { fields, wrapWhereClause: true });
    case 'OData':
      return formatQuery(query, format, { fields, wrapFilterClause: true });
    default:
      return formatQuery(query, format, { fields });
  }
};

export const inferCodeLanguage = (format: OutputFormat) => {
  switch (format) {
    case 'Native':
    case 'Mongo':
    case 'JsonLogic':
    case 'Elasticsearch':
    case 'Prisma':
    case 'Dynamo':
      return 'json';
    case 'SQL':
      return 'sql';
    case 'AQL':
      return 'sql';
    case 'OData':
    case 'RSQL':
    case 'CEL':
    case 'SpEL':
    case 'JSONata':
    case 'Django':
    default:
      return 'tsx';
  }
};

export { formatBuilderSource, type CustomizationMode } from './builder-source';
