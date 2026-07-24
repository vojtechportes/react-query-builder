import { describe, expect, it } from 'vitest';
import type { DenormalizedQuery } from '@vojtechportes/react-query-builder';
import { encodeRecipeQuery } from './encode-recipe-query.util';
import { getInitialRecipeUrlState } from './get-initial-recipe-url-state.util';

const initialQuery: DenormalizedQuery = [
  {
    type: 'GROUP',
    value: 'AND',
    isNegated: false,
    children: [{ field: 'status', operator: 'EQUAL', value: 'PAID' }],
  },
];
const validation = {
  allowedFields: ['status'],
  allowedOperators: ['EQUAL'],
} as const;

describe('getInitialRecipeUrlState', () => {
  it('returns a repairable clone when the filter is missing', () => {
    const result = getInitialRecipeUrlState(null, initialQuery, validation);

    expect(result).toEqual({
      error: null,
      query: initialQuery,
      shouldRepair: true,
    });
    expect(result.query).not.toBe(initialQuery);
  });

  it('returns a repairable fallback and error for an invalid filter', () => {
    const result = getInitialRecipeUrlState(
      'not-json',
      initialQuery,
      validation
    );

    expect(result.error).toBeTruthy();
    expect(result.query).toEqual(initialQuery);
    expect(result.shouldRepair).toBe(true);
  });

  it('restores a valid filter without requesting a URL rewrite', () => {
    const pendingQuery: DenormalizedQuery = [
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [{ field: 'status', operator: 'EQUAL', value: 'PENDING' }],
      },
    ];

    const result = getInitialRecipeUrlState(
      encodeRecipeQuery(pendingQuery),
      initialQuery,
      validation
    );

    expect(result).toEqual({
      error: null,
      query: pendingQuery,
      shouldRepair: false,
    });
  });
});
