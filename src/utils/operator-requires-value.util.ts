import { QueryOperator } from './query-operators';

export const operatorRequiresValue = (
  operator?: QueryOperator
): boolean => {
  return operator !== 'IS_NULL' && operator !== 'IS_NOT_NULL';
};
