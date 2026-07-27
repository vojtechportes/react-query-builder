import type { OutputFormat } from '../types/output-format';

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
