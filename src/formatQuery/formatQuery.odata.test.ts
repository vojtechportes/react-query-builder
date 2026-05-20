import type { DenormalizedQuery } from '../utils/query-tree';
import { formatQuery } from './index';

describe('formatQuery OData', () => {
  it('formats root-level rules with the configured combinator', () => {
    const query: DenormalizedQuery = [
      { field: 'price', operator: 'LARGER', value: 10 },
      { field: 'active', operator: 'EQUAL', value: true },
    ];

    expect(formatQuery(query, 'OData', { rootlessCombinator: 'OR' })).toEqual(
      '(price gt 10 or active eq true)'
    );
  });

  it('formats string and range operators with filter wrapper', () => {
    const query: DenormalizedQuery = [
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [
          { field: 'name', operator: 'STARTS_WITH', value: 'Stev' },
          { field: 'age', operator: 'BETWEEN', value: [18, 30] },
        ],
      },
    ];

    expect(
      formatQuery(query, 'OData', { wrapFilterClause: true })
    ).toEqual("$filter=(startswith(name,'Stev') and (age ge 18 and age le 30))");
  });
});
