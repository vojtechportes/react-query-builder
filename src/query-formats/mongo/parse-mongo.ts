import type { IParseQueryResult } from '../types';
import { inferMongoFields } from './infer-mongo-fields';
import { parseMongoExpression } from './parse-mongo-expression';

export const parseMongo = (value: string): IParseQueryResult => {
  const parsedValue = JSON.parse(value) as unknown;
  const data = parseMongoExpression(parsedValue);

  return {
    data,
    fields: inferMongoFields(data),
  };
};
