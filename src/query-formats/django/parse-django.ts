import type { IParseQueryResult } from '../types';
import { DjangoParser } from './django-parser';
import { inferDjangoFields } from './infer-django-fields';
import { toDenormalizedDjangoQuery } from './to-denormalized-django-node';

export const parseDjango = (value: string): IParseQueryResult => {
  const parser = new DjangoParser(value);
  const parsedNodes = parser.parse();
  const data = toDenormalizedDjangoQuery(parsedNodes);

  return {
    data,
    fields: inferDjangoFields(data),
  };
};
