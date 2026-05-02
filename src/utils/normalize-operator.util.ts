import { QueryOperator } from './query-operators';

export const normalizeOperator = (
  operator: QueryOperator
): QueryOperator => {
  switch (operator) {
    case 'ANY_IN':
      return 'IN';
    case 'LIKE':
      return 'CONTAINS';
    case 'NOT_LIKE':
      return 'NOT_CONTAINS';
    default:
      return operator;
  }
};
