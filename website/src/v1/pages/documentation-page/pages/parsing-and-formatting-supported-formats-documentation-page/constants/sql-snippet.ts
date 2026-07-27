export const sqlSnippet = `import { formatQuery } from '@vojtechportes/react-query-builder/formatQuery';

const sql = formatQuery(data, 'SQL', {
  fields,
  wrapWhereClause: true,
});

// WHERE (CUSTOMER_COUNTRY = 'CZ' AND ORDER_TOTAL BETWEEN 1000 AND 5000)`;
