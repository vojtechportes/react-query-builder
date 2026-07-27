import { QueryOperator, queryOperators } from '../constants/query-operators';

export const isOperator = (value: unknown): value is QueryOperator => {
  return typeof value === 'string' && value in queryOperators;
};
