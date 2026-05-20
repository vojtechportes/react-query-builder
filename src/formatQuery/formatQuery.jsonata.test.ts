import type { DenormalizedQuery } from '../utils/query-tree';
import { formatQuery } from './index';

describe('formatQuery JSONata', () => {
  it('formats root-level rules with the configured combinator', () => {
    const query: DenormalizedQuery = [
      { field: 'price', operator: 'LARGER', value: 10 },
      { field: 'active', operator: 'EQUAL', value: true },
    ];

    expect(
      formatQuery(query, 'JSONata', { rootlessCombinator: 'OR' })
    ).toEqual('(price > 10 or active = true)');
  });

  it('formats text operators through JSONata string helpers', () => {
    const query: DenormalizedQuery = [
      { field: 'name', operator: 'STARTS_WITH', value: 'Stev' },
    ];

    expect(formatQuery(query, 'JSONata')).toEqual(
      '$contains(name, /^Stev/)'
    );
  });
});

