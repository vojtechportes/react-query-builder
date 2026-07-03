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

  it('keeps boolean rhs values as literals', () => {
    const result = parseQuery(
      '(active == true and archived != false)',
      'SpEL'
    );

    expect(result.data).toEqual([
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [
          { field: 'active', operator: 'EQUAL', value: true },
          { field: 'archived', operator: 'NOT_EQUAL', value: false },
        ],
      },
    ]);
  });

  it('parses field-to-field scalar comparisons and infers both fields', () => {
    const result = parseQuery(
      '(price >= cost and discount < max_discount and name == fallback_name and status != archived_status)',
      'SpEL'
    );

    expect(result.data).toEqual([
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
    ]);

    expect(result.fields).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: 'price' }),
        expect.objectContaining({ field: 'cost' }),
        expect.objectContaining({ field: 'discount' }),
        expect.objectContaining({ field: 'max_discount' }),
        expect.objectContaining({ field: 'name' }),
        expect.objectContaining({ field: 'fallback_name' }),
        expect.objectContaining({ field: 'status' }),
        expect.objectContaining({ field: 'archived_status' }),
      ])
    );
  });

  it('parses native field-to-field string method comparisons', () => {
    const result = parseQuery(
      '(name.contains(needle) and name.startsWith(prefix) and name.endsWith(suffix) and !(status.contains(archived_status)))',
      'SpEL'
    );

    expect(result.data).toEqual([
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [
          { field: 'name', operator: 'CONTAINS', valueSource: 'field', valueField: 'needle' },
          { field: 'name', operator: 'STARTS_WITH', valueSource: 'field', valueField: 'prefix' },
          { field: 'name', operator: 'ENDS_WITH', valueSource: 'field', valueField: 'suffix' },
          { field: 'status', operator: 'NOT_CONTAINS', valueSource: 'field', valueField: 'archived_status' },
        ],
      },
    ]);

    expect(result.fields).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: 'name' }),
        expect.objectContaining({ field: 'needle' }),
        expect.objectContaining({ field: 'prefix' }),
        expect.objectContaining({ field: 'suffix' }),
        expect.objectContaining({ field: 'status' }),
        expect.objectContaining({ field: 'archived_status' }),
      ])
    );
  });

  it('does not collapse same-field field references into literal ranges', () => {
    const result = parseQuery(
      '(price >= min_price and price <= max_price)',
      'SpEL'
    );

    expect(result.data).toEqual([
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [
          {
            field: 'price',
            operator: 'LARGER_EQUAL',
            valueSource: 'field',
            valueField: 'min_price',
          },
          {
            field: 'price',
            operator: 'SMALLER_EQUAL',
            valueSource: 'field',
            valueField: 'max_price',
          },
        ],
      },
    ]);
  });

  it('does not collapse same-field field references into literal not-between ranges', () => {
    const result = parseQuery(
      '(price < min_price or price > max_price)',
      'SpEL'
    );

    expect(result.data).toEqual([
      {
        type: 'GROUP',
        value: 'OR',
        isNegated: false,
        children: [
          {
            field: 'price',
            operator: 'SMALLER',
            valueSource: 'field',
            valueField: 'min_price',
          },
          {
            field: 'price',
            operator: 'LARGER',
            valueSource: 'field',
            valueField: 'max_price',
          },
        ],
      },
    ]);
  });

  it('still collapses literal not-between ranges normally', () => {
    const result = parseQuery(
      '(price < 10 or price > 20)',
      'SpEL'
    );

    expect(result.data).toEqual([
      { field: 'price', operator: 'NOT_BETWEEN', value: [10, 20] },
    ]);
  });

  it('still collapses literal ranges normally', () => {
    const result = parseQuery(
      '(price >= 10 and price <= 20)',
      'SpEL'
    );

    expect(result.data).toEqual([
      { field: 'price', operator: 'BETWEEN', value: [10, 20] },
    ]);
  });
});
