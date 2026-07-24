import React from 'react';
import { Builder } from '@vojtechportes/react-query-builder';
import { parseQuery } from '@vojtechportes/react-query-builder/parseQuery';

const sql = "WHERE status = 'PAID' AND total >= 100";
const parsed = parseQuery(sql.replace(/^WHERE\s+/i, ''), 'SQL');

export const SqlImportFilter = () => {
  return <Builder fields={parsed.fields} data={parsed.data} />;
};
