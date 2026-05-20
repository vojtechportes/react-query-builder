import type { DenormalizedQuery } from '../utils/query-tree';
import { formatQuery } from './index';

describe('formatQuery Mongo', () => {
  it('formats root-level rules with the configured combinator', () => {
    const query: DenormalizedQuery = [
      { field: 'price', operator: 'LARGER', value: 10 },
      { field: 'active', operator: 'EQUAL', value: true },
    ];

    expect(formatQuery(query, 'Mongo', { rootlessCombinator: 'OR' })).toEqual(
      JSON.stringify(
        {
          $or: [{ price: { $gt: 10 } }, { active: true }],
        },
        null,
        2
      )
    );
  });

  it('formats groups without modifiers using the configured combinator', () => {
    const query: DenormalizedQuery = [
      {
        type: 'GROUP',
        children: [
          { field: 'first_name', operator: 'EQUAL', value: 'Alice' },
          { field: 'last_name', operator: 'EQUAL', value: 'Smith' },
        ],
      },
    ];

    expect(
      formatQuery(query, 'Mongo', { modifierlessGroupCombinator: 'OR' })
    ).toEqual(
      JSON.stringify(
        {
          $or: [{ first_name: 'Alice' }, { last_name: 'Smith' }],
        },
        null,
        2
      )
    );
  });
});

