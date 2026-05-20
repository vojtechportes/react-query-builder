import { parseQuery } from './index';

describe('parseQuery SpEL', () => {
  it('parses logical groups and comparisons', () => {
    const result = parseQuery(
      "(status == 'active' and age >= 18)",
      'SpEL'
    );

    expect(result.data).toEqual([
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [
          { field: 'status', operator: 'EQUAL', value: 'active' },
          { field: 'age', operator: 'LARGER_EQUAL', value: 18 },
        ],
      },
    ]);
  });

  it('parses contains, not-in, and all-in logic', () => {
    const result = parseQuery(
      "(tags.contains('pro') and !({'archived', 'deleted'}.contains(status)) and ({'b2b', 'priority'}.?[customer.segments.contains(#this)].size() == 2))",
      'SpEL'
    );

    expect(result.data).toEqual([
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [
          { field: 'tags', operator: 'CONTAINS', value: 'pro' },
          {
            field: 'status',
            operator: 'NOT_IN',
            value: ['archived', 'deleted'],
          },
          {
            field: 'customer.segments',
            operator: 'ALL_IN',
            value: ['b2b', 'priority'],
          },
        ],
      },
    ]);
  });
});
