import { describe, expect, it } from 'vitest';
import { validateMockSearchRequest } from './validate-mock-search-request.util';

const request = {
  query: [
    {
      type: 'GROUP',
      value: 'AND',
      isNegated: false,
      children: [{ field: 'amount', operator: 'LARGER_EQUAL', value: 100 }],
    },
  ],
  page: 1,
  pageSize: 5,
};

describe('validateMockSearchRequest', () => {
  it('accepts the documented request contract', () => {
    expect(validateMockSearchRequest(request)).toEqual(request);
  });

  it('rejects disallowed fields, oversized values, and page sizes', () => {
    expect(() =>
      validateMockSearchRequest({
        ...request,
        query: [
          {
            type: 'GROUP',
            value: 'AND',
            isNegated: false,
            children: [{ field: 'tenantId', operator: 'EQUAL', value: 'x' }],
          },
        ],
      })
    ).toThrow('disallowed');
    expect(() =>
      validateMockSearchRequest({
        ...request,
        query: [
          {
            type: 'GROUP',
            value: 'AND',
            isNegated: false,
            children: [
              { field: 'status', operator: 'EQUAL', value: 'x'.repeat(81) },
            ],
          },
        ],
      })
    ).toThrow('disallowed');
    expect(() =>
      validateMockSearchRequest({ ...request, pageSize: 6 })
    ).toThrow('pageSize');
  });
});
