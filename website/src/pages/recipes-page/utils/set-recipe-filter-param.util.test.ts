import { describe, expect, it } from 'vitest';
import type { DenormalizedQuery } from '@vojtechportes/react-query-builder';
import { decodeRecipeQuery } from './decode-recipe-query.util';
import { encodeRecipeQuery } from './encode-recipe-query.util';
import { setRecipeFilterParam } from './set-recipe-filter-param.util';

const query: DenormalizedQuery = [
  {
    type: 'GROUP',
    value: 'AND',
    isNegated: false,
    children: [{ field: 'status', operator: 'EQUAL', value: 'PAID' }],
  },
];

describe('recipe URL utilities', () => {
  it('round-trips valid query data', () => {
    expect(decodeRecipeQuery(encodeRecipeQuery(query))).toEqual(query);
  });

  it('rejects invalid encoded data', () => {
    expect(() => decodeRecipeQuery('{"bad":true}')).toThrow(
      'unsupported structure'
    );
  });

  it('preserves unrelated parameters when setting and removing filters', () => {
    const initial = new URLSearchParams('campaign=docs');
    const withFilter = setRecipeFilterParam(initial, encodeRecipeQuery(query));
    expect(withFilter.get('campaign')).toBe('docs');
    expect(withFilter.has('filter')).toBe(true);
    const reset = setRecipeFilterParam(withFilter, null);
    expect(reset.toString()).toBe('campaign=docs');
  });
  it('rejects fields and operators outside the URL recipe schema', () => {
    const unsafe = JSON.stringify([
      {
        type: 'GROUP',
        value: 'AND',
        children: [{ field: 'tenantId', operator: 'DELETE', value: 'one' }],
      },
    ]);

    expect(() =>
      decodeRecipeQuery(unsafe, {
        allowedFields: ['status', 'total'],
        allowedOperators: [
          'EQUAL',
          'NOT_EQUAL',
          'LARGER_EQUAL',
          'SMALLER_EQUAL',
        ],
      })
    ).toThrow('unsupported structure');
  });
});
