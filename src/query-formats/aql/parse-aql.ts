import type { IParseQueryResult } from '../types';
import { AqlParser } from './aql-parser';
import { inferAqlFields } from './infer-aql-fields';
import { toDenormalizedAqlQuery } from './to-denormalized-aql-node';

export const parseAql = (value: string): IParseQueryResult => {
  const parser = new AqlParser(value);
  const parsedNodes = parser.parse();
  const data = toDenormalizedAqlQuery(parsedNodes);

  return {
    data,
    fields: inferAqlFields(data),
  };
};

