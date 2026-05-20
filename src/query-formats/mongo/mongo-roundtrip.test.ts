import type { DenormalizedQuery } from '../../utils/query-tree';
import { formatQuery } from '../../formatQuery';
import { parseQuery } from '../../parseQuery';

describe('Mongo roundtrip', () => {
  it('round-trips a supported query subset', () => {
    const query: DenormalizedQuery = [
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [
          { field: 'name', operator: 'CONTAINS', value: 'Al' },
          { field: 'age', operator: 'BETWEEN', value: [18, 30] },
          {
            type: 'GROUP',
            value: 'OR',
            isNegated: true,
            children: [
              { field: 'status', operator: 'EQUAL', value: 'active' },
              { field: 'score', operator: 'LARGER', value: 100 },
            ],
          },
        ],
      },
    ];

    const mongo = formatQuery(query, 'Mongo');
    const parsed = parseQuery(mongo, 'Mongo');

    expect(parsed.data).toEqual(query);
  });
});

