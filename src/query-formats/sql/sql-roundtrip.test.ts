import type { DenormalizedQuery } from '../../utils/query-tree';
import { formatQuery } from '../../formatQuery';
import { parseQuery } from '../../parseQuery';

describe('SQL roundtrip', () => {
  it('round-trips a supported query subset', () => {
    const query: DenormalizedQuery = [
      {
        type: 'GROUP',
        value: 'OR',
        isNegated: false,
        children: [
          { field: 'name', operator: 'CONTAINS', value: 'Al' },
          { field: 'age', operator: 'BETWEEN', value: [18, 30] },
        ],
      },
    ];

    const sql = formatQuery(query, 'SQL');
    const parsed = parseQuery(sql, 'SQL');

    expect(parsed.data).toEqual(query);
  });

  it('preserves explicit nested single-rule groups', () => {
    const query: DenormalizedQuery = [
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [
          { field: 'name', operator: 'EQUAL', value: 'Al' },
          {
            type: 'GROUP',
            value: 'AND',
            isNegated: false,
            children: [{ field: 'city', operator: 'EQUAL', value: 'Prague' }],
          },
        ],
      },
    ];

    const sql = formatQuery(query, 'SQL');
    const parsed = parseQuery(sql, 'SQL');

    expect(parsed.data).toEqual(query);
  });
});

