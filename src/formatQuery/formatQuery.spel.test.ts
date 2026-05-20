import type { DenormalizedQuery } from '../utils/query-tree';
import { formatQuery } from './index';

describe('formatQuery SpEL', () => {
  it('formats root-level rules with the configured combinator', () => {
    const query: DenormalizedQuery = [
      { field: 'price', operator: 'LARGER', value: 10 },
      { field: 'active', operator: 'EQUAL', value: true },
    ];

    expect(formatQuery(query, 'SpEL', { rootlessCombinator: 'OR' })).toEqual(
      '(price > 10 or active == true)'
    );
  });

  it('formats string, range, and collection operators', () => {
    const query: DenormalizedQuery = [
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [
          { field: 'name', operator: 'STARTS_WITH', value: 'Stev' },
          { field: 'age', operator: 'BETWEEN', value: [18, 30] },
          { field: 'segments', operator: 'ALL_IN', value: ['b2b', 'priority'] },
        ],
      },
    ];

    expect(formatQuery(query, 'SpEL')).toEqual(
      "(name.startsWith('Stev') and (age >= 18 and age <= 30) and ({'b2b', 'priority'}.?[segments.contains(#this)].size() == 2))"
    );
  });
});
