import { parseQuery } from './index';

describe('parseQuery Elasticsearch', () => {
  it('parses bool groups, range, prefix, and null checks', () => {
    const result = parseQuery(
      JSON.stringify({
        query: {
          bool: {
            must: [
              { range: { price: { gte: 10, lte: 20 } } },
              { prefix: { name: 'Stev' } },
            ],
            must_not: [{ exists: { field: 'archived_at' } }],
          },
        },
      }),
      'Elasticsearch'
    );

    expect(result.data).toEqual([
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [
          { field: 'price', operator: 'BETWEEN', value: [10, 20] },
          { field: 'name', operator: 'STARTS_WITH', value: 'Stev' },
          { field: 'archived_at', operator: 'IS_NULL' },
        ],
      },
    ]);
  });

  it('parses should groups and wildcard operators', () => {
    const result = parseQuery(
      JSON.stringify({
        bool: {
          should: [
            { wildcard: { tags: { value: '*pro*' } } },
            { terms: { status: ['archived', 'deleted'] } },
          ],
          minimum_should_match: 1,
        },
      }),
      'Elasticsearch'
    );

    expect(result.data).toEqual([
      {
        type: 'GROUP',
        value: 'OR',
        isNegated: false,
        children: [
          { field: 'tags', operator: 'CONTAINS', value: 'pro' },
          { field: 'status', operator: 'IN', value: ['archived', 'deleted'] },
        ],
      },
    ]);
  });
});
