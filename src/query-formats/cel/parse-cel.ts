import type { IParseQueryResult } from '../types';
import { CelParser } from './cel-parser';
import { inferCelFields } from './infer-cel-fields';
import { toDenormalizedCelQuery } from './to-denormalized-cel-node';

export const parseCel = (value: string): IParseQueryResult => {
  const parser = new CelParser(value);
  const parsedNodes = parser.parse();
  const data = toDenormalizedCelQuery(parsedNodes);

  return {
    data,
    fields: inferCelFields(data),
  };
};
