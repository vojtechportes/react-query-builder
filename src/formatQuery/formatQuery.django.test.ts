import type { DenormalizedQuery } from '../utils/query-tree';
import { formatQuery } from './index';

describe('formatQuery Django', () => {
  it('formats root-level rules with the configured combinator', () => {
    const query: DenormalizedQuery = [
      { field: 'price', operator: 'LARGER', value: 10 },
      { field: 'active', operator: 'EQUAL', value: true },
    ];

    expect(formatQuery(query, 'Django', { rootlessCombinator: 'OR' })).toEqual(
      "(Q(price__gt=10) | Q(active=True))"
    );
  });

  it('formats lookups, membership, and range operators', () => {
    const query: DenormalizedQuery = [
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [
          { field: 'name', operator: 'STARTS_WITH', value: 'Stev' },
          { field: 'status', operator: 'IN', value: ['active', 'trial'] },
          { field: 'age', operator: 'BETWEEN', value: [18, 30] },
        ],
      },
    ];

    expect(formatQuery(query, 'Django')).toEqual(
      "(Q(name__startswith='Stev') & Q(status__in=['active', 'trial']) & Q(age__gte=18, age__lte=30))"
    );
  });
});
