import { QueryOperator } from './query-operators';

export const isRangeOperator = (operator?: QueryOperator): boolean => {
  return operator === 'BETWEEN' || operator === 'NOT_BETWEEN';
};
