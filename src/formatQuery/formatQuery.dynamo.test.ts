import type { DenormalizedQuery } from '../utils/query-tree';
import { formatQuery } from './index';

describe('formatQuery Dynamo', () => {
  it('formats root-level rules with the configured combinator', () => {
    const query: DenormalizedQuery = [
      { field: 'price', operator: 'LARGER', value: 10 },
      { field: 'active', operator: 'EQUAL', value: true },
    ];

    expect(formatQuery(query, 'Dynamo', { rootlessCombinator: 'OR' })).toEqual(
      '(price > 10 OR active = true)'
    );
  });

  it('formats functions, membership, and range operators', () => {
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

    expect(formatQuery(query, 'Dynamo')).toEqual(
      "(begins_with(name, 'Stev') AND status IN ('active', 'trial') AND age BETWEEN 18 AND 30)"
    );
  });
});
