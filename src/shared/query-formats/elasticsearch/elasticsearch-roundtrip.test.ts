import type { DenormalizedQuery } from '../../query/model/types/query-tree';
import { formatElasticsearch } from './format-elasticsearch';
import { parseElasticsearch } from './parse-elasticsearch';

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

    const expression = formatElasticsearch(query);
    const parsed = parseElasticsearch(expression);

    expect(parsed.data).toEqual(query);
  });
});
