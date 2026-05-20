import type { IParseQueryResult } from '../types';
import { inferPrismaFields } from './infer-prisma-fields';
import { parsePrismaExpression } from './parse-prisma-expression';

export const parsePrisma = (value: string): IParseQueryResult => {
  const parsedValue = JSON.parse(value) as unknown;
  const data = parsePrismaExpression(parsedValue);

  return {
    data,
    fields: inferPrismaFields(data),
  };
};
