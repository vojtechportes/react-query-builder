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

  it('parses field-to-field scalar comparisons and infers both fields', () => {
    const result = parseQuery(
      '(price >= cost && discount < max_discount && name == fallback_name && status != archived_status)',
      'CEL'
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

  it('does not collapse same-field field references into literal range operators', () => {
    const result = parseQuery(
      '(price >= min_price && price <= max_price)',
      'CEL'
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

  it('does not collapse same-field field references into literal not-between operators', () => {
    const result = parseQuery(
      '(price < min_price || price > max_price)',
      'CEL'
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

  it('still collapses literal ranges normally', () => {
    const result = parseQuery(
      '(price >= 10 && price <= 20)',
      'CEL'
    );

    expect(result.data).toEqual([
      { field: 'price', operator: 'BETWEEN', value: [10, 20] },
    ]);
  });

  it('parses native field-to-field string method comparisons', () => {
    const result = parseQuery(
      '(profile.name.contains(profile.needle) && profile.name.startsWith(profile.prefix) && profile.name.endsWith(profile.suffix) && profile.name.matches(profile.pattern))',
      'CEL'
    );

    expect(result.data).toEqual([
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [
          { field: 'profile.name', operator: 'CONTAINS', valueSource: 'field', valueField: 'profile.needle' },
          { field: 'profile.name', operator: 'STARTS_WITH', valueSource: 'field', valueField: 'profile.prefix' },
          { field: 'profile.name', operator: 'ENDS_WITH', valueSource: 'field', valueField: 'profile.suffix' },
          { field: 'profile.name', operator: 'LIKE', valueSource: 'field', valueField: 'profile.pattern' },
        ],
      },
    ]);
  });

  it('rejects computed rhs expressions for native field-to-field string methods', () => {
    expect(() =>
      parseQuery(
        '(profile.name.contains(profile.prefix.startsWith("A")))',
        'CEL'
      )
    ).toThrow('Expected token "RPAREN" but found ".".');
  });
});
