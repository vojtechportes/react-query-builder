import type { IParseQueryResult } from '../types';
import { inferSqlFields } from './infer-sql-fields';
import { SqlParser } from './sql-parser';
import { toDenormalizedSqlQuery } from './to-denormalized-sql-node';

export const parseSql = (value: string): IParseQueryResult => {
  const parser = new SqlParser(value);
  const parsedNodes = parser.parse();
  const data = toDenormalizedSqlQuery(parsedNodes);

  return {
    data,
    fields: inferSqlFields(data),
  };
};

