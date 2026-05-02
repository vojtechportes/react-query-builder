import { QueryOperator, queryOperators } from './query-operators';

export const isOperator = (value: unknown): value is QueryOperator => {
  return typeof value === 'string' && value in queryOperators;
};
