import { recipeDemoRows } from '../constants/recipe-demo-rows';
import type { IMockSearchRequest } from '../types/mock-search-request';
import { doesRecipeRowMatch } from './does-recipe-row-match.util';
import { validateMockSearchRequest } from './validate-mock-search-request.util';

export const mockSearchOrders = (
  value: IMockSearchRequest,
  signal: AbortSignal
): Promise<typeof recipeDemoRows> => {
  const request = validateMockSearchRequest(value);
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      resolve(
        recipeDemoRows
          .filter((row) => doesRecipeRowMatch(row, request.query))
          .slice(
            (request.page - 1) * request.pageSize,
            request.page * request.pageSize
          )
      );
    }, 650);
    signal.addEventListener(
      'abort',
      () => {
        clearTimeout(timer);
        reject(new DOMException('Request cancelled.', 'AbortError'));
      },
      { once: true }
    );
  });
};
