import { QueryOperator } from './query-tree';

export const isOperator = (value: unknown): value is QueryOperator => {
  return Boolean(value);
};
