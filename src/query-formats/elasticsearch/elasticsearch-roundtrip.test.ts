import type { DenormalizedQuery } from '../../utils/query-tree';
import { formatQuery } from '../../formatQuery';
import { parseQuery } from '../../parseQuery';

describe('Elasticsearch roundtrip', () => {
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

    const expression = formatQuery(query, 'Elasticsearch');
    const parsed = parseQuery(expression, 'Elasticsearch');

    expect(parsed.data).toEqual(query);
  });
});
