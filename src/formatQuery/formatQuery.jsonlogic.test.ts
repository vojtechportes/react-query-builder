import type { DenormalizedQuery } from '../utils/query-tree';
import { formatQuery } from './index';

describe('formatQuery JsonLogic', () => {
  it('formats root-level rules with the configured combinator', () => {
    const query: DenormalizedQuery = [
      { field: 'price', operator: 'LARGER', value: 10 },
      { field: 'active', operator: 'EQUAL', value: true },
    ];

    expect(formatQuery(query, 'JsonLogic', { rootlessCombinator: 'OR' })).toEqual(
      JSON.stringify(
        {
          or: [
            { '>': [{ var: 'price' }, 10] },
            { '==': [{ var: 'active' }, true] },
          ],
        },
        null,
        2
      )
    );
  });

  it('formats string and range operators', () => {
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

    expect(formatQuery(query, 'JsonLogic')).toEqual(
      JSON.stringify(
        {
          and: [
            { '==': [{ substr: [{ var: 'name' }, 0, 4] }, 'Stev'] },
            { '<=': [18, { var: 'age' }, 30] },
          ],
        },
        null,
        2
      )
    );
  });
});

