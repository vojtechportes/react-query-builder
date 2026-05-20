import type { DenormalizedQuery } from '../utils/query-tree';
import { formatQuery } from './index';

describe('formatQuery AQL', () => {
  it('formats root-level rules with FILTER wrapping', () => {
    const query: DenormalizedQuery = [
      { field: 'price', operator: 'LARGER', value: 10 },
      { field: 'active', operator: 'EQUAL', value: true },
    ];

    expect(
      formatQuery(query, 'AQL', {
        rootlessCombinator: 'OR',
        variableName: 'item',
      })
    ).toEqual('FILTER (item.price > 10 OR item.active == true)');
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
      formatQuery(query, 'AQL', {
        modifierlessGroupCombinator: 'OR',
        wrapFilterClause: false,
      })
    ).toEqual('(doc.first_name == "Alice" OR doc.last_name == "Smith")');
  });
});

