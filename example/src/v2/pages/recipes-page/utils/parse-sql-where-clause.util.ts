import { parseQuery } from '@vojtechportes/react-query-builder/parseQuery';

export const parseSqlWhereClause = (sql: string) =>
  parseQuery(sql.trim().replace(/^WHERE\s+/i, ''), 'SQL');
