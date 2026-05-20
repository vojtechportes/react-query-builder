import type { IParseQueryResult } from '../types';
import { DynamoParser } from './dynamo-parser';
import { inferDynamoFields } from './infer-dynamo-fields';
import { toDenormalizedDynamoQuery } from './to-denormalized-dynamo-node';

export const parseDynamo = (value: string): IParseQueryResult => {
  const parser = new DynamoParser(value);
  const parsedNodes = parser.parse();
  const data = toDenormalizedDynamoQuery(parsedNodes);

  return {
    data,
    fields: inferDynamoFields(data),
  };
};
