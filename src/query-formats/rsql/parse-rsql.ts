import type { IParseQueryResult } from '../types';
import { inferRsqlFields } from './infer-rsql-fields';
import { RsqlParser } from './rsql-parser';
import { toDenormalizedRsqlQuery } from './to-denormalized-rsql-node';

export const parseRsql = (value: string): IParseQueryResult => {
  const parser = new RsqlParser(value);
  const parsedNodes = parser.parse();
  const data = toDenormalizedRsqlQuery(parsedNodes);

  return {
    data,
    fields: inferRsqlFields(data),
  };
};
