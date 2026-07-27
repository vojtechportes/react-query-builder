import type { OutputFormat } from '../types/output-format';

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
