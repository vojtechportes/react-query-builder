import type { IParseQueryResult } from '../types';
import { inferODataFields } from './infer-odata-fields';
import { ODataParser } from './odata-parser';
import { toDenormalizedODataQuery } from './to-denormalized-odata-node';

export const parseOData = (value: string): IParseQueryResult => {
  const parser = new ODataParser(value);
  const parsedNodes = parser.parse();
  const data = toDenormalizedODataQuery(parsedNodes);

  return {
    data,
    fields: inferODataFields(data),
  };
};
