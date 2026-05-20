import { parseQuery } from './index';

describe('parseQuery CEL', () => {
  it('parses logical groups and comparisons', () => {
    const result = parseQuery(
      '(status == "active" && age >= 18)',
      'CEL'
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

  it('parses string methods, not-in, and list macros', () => {
    const result = parseQuery(
      '(tags.contains("pro") && !(status in ["archived", "deleted"]) && ["b2b", "priority"].all(item, item in customer.segments))',
      'CEL'
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
