import type { IParseQueryResult } from '../types';
import { inferJsonLogicFields } from './infer-json-logic-fields';
import { parseJsonLogicExpression } from './parse-json-logic-expression';

export const parseJsonLogic = (value: string): IParseQueryResult => {
  const parsedValue = JSON.parse(value) as unknown;
  const data = parseJsonLogicExpression(parsedValue);

  return {
    data,
    fields: inferJsonLogicFields(data),
  };
};
