import type { IParseQueryResult } from '../types';
import { inferSpelFields } from './infer-spel-fields';
import { parseSpelExpression } from './parse-spel-expression';

export const parseSpel = (value: string): IParseQueryResult => {
  const data = parseSpelExpression(value);

  return {
    data,
    fields: inferSpelFields(data),
  };
};
