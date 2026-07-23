import type {
  DenormalizedQuery,
  IBuilderFieldProps,
} from '@vojtechportes/react-query-builder';
import { formatQuery } from '@vojtechportes/react-query-builder/formatQuery';
import type { SupportedQueryFormat } from '../types/supported-query-format';

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
