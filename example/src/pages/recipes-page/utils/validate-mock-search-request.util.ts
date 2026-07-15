import type { IMockSearchRequest } from '../types/i-mock-search-request';
import { isRecipeQuery } from './is-recipe-query.util';

export const validateMockSearchRequest = (
  value: unknown
): IMockSearchRequest => {
  if (typeof value !== 'object' || value === null) {
    throw new Error('Request must be an object.');
  }
  const request = value as Record<string, unknown>;
  if (
    !isRecipeQuery(request.query, {
      allowedFields: ['status', 'amount'],
      allowedOperators: ['EQUAL', 'NOT_EQUAL', 'LARGER_EQUAL', 'SMALLER_EQUAL'],
      maxDepth: 4,
      maxRules: 12,
      maxValueLength: 80,
    })
  ) {
    throw new Error(
      'The query contains a disallowed field, operator, or shape.'
    );
  }
  if (
    !Number.isInteger(request.page) ||
    Number(request.page) < 1 ||
    !Number.isInteger(request.pageSize) ||
    Number(request.pageSize) < 1 ||
    Number(request.pageSize) > 5
  ) {
    throw new Error('Page must be positive and pageSize cannot exceed 5.');
  }
  return request as unknown as IMockSearchRequest;
};
