import type { IParseQueryResult } from '../types';
import { inferJsonataFields } from './infer-jsonata-fields';
import { JsonataParser } from './jsonata-parser';
import { toDenormalizedJsonataQuery } from './to-denormalized-jsonata-node';

export const parseJsonata = (value: string): IParseQueryResult => {
  const parser = new JsonataParser(value);
  const parsedNodes = parser.parse();
  const data = toDenormalizedJsonataQuery(parsedNodes);

  return {
    data,
    fields: inferJsonataFields(data),
  };
};
