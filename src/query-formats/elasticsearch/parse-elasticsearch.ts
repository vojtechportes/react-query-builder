import type { IParseQueryResult } from '../types';
import { inferElasticsearchFields } from './infer-elasticsearch-fields';
import { parseElasticsearchExpression } from './parse-elasticsearch-expression';

export const parseElasticsearch = (value: string): IParseQueryResult => {
  const parsedValue = JSON.parse(value) as unknown;
  const data = parseElasticsearchExpression(parsedValue);

  return {
    data,
    fields: inferElasticsearchFields(data),
  };
};
