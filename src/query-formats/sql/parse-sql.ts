import type { IParseQueryResult } from '../types';
import { tryParseSql } from './try-parse-sql';

export const parseSql = (value: string): IParseQueryResult => {
  const result = tryParseSql(value);

  if (!result.data || !result.fields) {
    throw new Error(result.diagnostics[0]?.message || 'Unknown SQL parse error.');
  }

  return {
    data: result.data,
    fields: result.fields,
  };
};

