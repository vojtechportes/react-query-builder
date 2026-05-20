import type { DenormalizedQuery } from '../utils/query-tree';
import { formatQuery } from './index';

describe('formatQuery CEL', () => {
  it('formats root-level rules with the configured combinator', () => {
    const query: DenormalizedQuery = [
      { field: 'price', operator: 'LARGER', value: 10 },
      { field: 'active', operator: 'EQUAL', value: true },
    ];

    expect(formatQuery(query, 'CEL', { rootlessCombinator: 'OR' })).toEqual(
      '(price > 10 || active == true)'
    );
  });

  it('formats string, range, and membership operators', () => {
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

    expect(formatQuery(query, 'CEL')).toEqual(
      '(name.startsWith("Stev") && (age >= 18 && age <= 30) && ["b2b", "priority"].all(item, item in segments))'
    );
  });
});
