export const fieldComparisonFormatSnippet = `import { type DenormalizedQuery } from '@vojtechportes/react-query-builder';
import { formatQuery } from '@vojtechportes/react-query-builder/formatQuery';

const data: DenormalizedQuery = [
  {
    type: 'GROUP',
    value: 'AND',
    isNegated: false,
    children: [
      {
        field: 'ORDER_TOTAL',
        operator: 'LARGER_EQUAL',
        valueSource: 'field',
        valueField: 'ORDER_APPROVAL_LIMIT',
      },
    ],
  },
];

const sql = formatQuery(data, 'SQL', {
  fields,
  wrapWhereClause: true,
});

// WHERE ORDER_TOTAL >= ORDER_APPROVAL_LIMIT`;
