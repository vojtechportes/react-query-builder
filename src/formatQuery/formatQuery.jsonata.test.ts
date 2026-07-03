import type { DenormalizedQuery } from '../utils/query-tree';
import { formatQuery } from './index';

describe('formatQuery JSONata', () => {
  it('formats root-level rules with the configured combinator', () => {
    const query: DenormalizedQuery = [
      { field: 'price', operator: 'LARGER', value: 10 },
      { field: 'active', operator: 'EQUAL', value: true },
    ];

    expect(
      formatQuery(query, 'JSONata', { rootlessCombinator: 'OR' })
    ).toEqual('(price > 10 or active = true)');
  });

  it('formats text operators through JSONata string helpers', () => {
    const query: DenormalizedQuery = [
      { field: 'name', operator: 'STARTS_WITH', value: 'Stev' },
    ];

    expect(formatQuery(query, 'JSONata')).toEqual(
      '$contains(name, /^Stev/)'
    );
  });

  it('formats supported field-to-field scalar comparisons', () => {
    const query: DenormalizedQuery = [
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [
          {
            field: 'price',
            operator: 'LARGER_EQUAL',
            valueSource: 'field',
            valueField: 'cost',
          },
          {
            field: 'discount',
            operator: 'SMALLER',
            valueSource: 'field',
            valueField: 'max_discount',
          },
          {
            field: 'name',
            operator: 'EQUAL',
            valueSource: 'field',
            valueField: 'fallback_name',
          },
          {
            field: 'status',
            operator: 'NOT_EQUAL',
            valueSource: 'field',
            valueField: 'archived_status',
          },
        ],
      },
    ];

    expect(formatQuery(query, 'JSONata')).toEqual(
      '(price >= cost and discount < max_discount and name = fallback_name and status != archived_status)'
    );
  });
});
