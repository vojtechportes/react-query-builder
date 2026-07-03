import type { DenormalizedQuery } from '../utils/query-tree';
import { formatQuery } from './index';

describe('formatQuery Elasticsearch', () => {
  it('formats root-level rules with the configured combinator', () => {
    const query: DenormalizedQuery = [
      { field: 'price', operator: 'LARGER', value: 10 },
      { field: 'active', operator: 'EQUAL', value: true },
    ];

    expect(
      formatQuery(query, 'Elasticsearch', { rootlessCombinator: 'OR' })
    ).toEqual(
      JSON.stringify(
        {
          bool: {
            should: [
              { range: { price: { gt: 10 } } },
              { term: { active: true } },
            ],
            minimum_should_match: 1,
          },
        },
        null,
        2
      )
    );
  });

  it('formats query wrapper and string operators', () => {
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
      formatQuery(query, 'Elasticsearch', { wrapQueryClause: true })
    ).toEqual(
      JSON.stringify(
        {
          query: {
            bool: {
              must: [
                { prefix: { name: 'Stev' } },
                { range: { age: { gte: 18, lte: 30 } } },
              ],
            },
          },
        },
        null,
        2
      )
    );
  });

  it('throws explicitly for unsupported field-to-field comparisons', () => {
    const query: DenormalizedQuery = [
      {
        field: 'price',
        operator: 'LARGER_EQUAL',
        valueSource: 'field',
        valueField: 'cost',
      },
    ];

    expect(() => formatQuery(query, 'Elasticsearch')).toThrow(
      'Elasticsearch does not support field-to-field comparisons for field "price" and operator "LARGER_EQUAL".'
    );
  });
});
