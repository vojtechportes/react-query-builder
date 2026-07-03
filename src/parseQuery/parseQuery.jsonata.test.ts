import { parseQuery } from './index';

describe('parseQuery JSONata', () => {
  it('parses comparisons and contains expressions', () => {
    const result = parseQuery(
      '$contains(first_name, /^Stev/) and age >= 18',
      'JSONata'
    );

    expect(result.data).toEqual([
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [
          { field: 'first_name', operator: 'STARTS_WITH', value: 'Stev' },
          { field: 'age', operator: 'LARGER_EQUAL', value: 18 },
        ],
      },
    ]);
  });

  it('parses list membership and negated contains', () => {
    const result = parseQuery(
      'status in ["open", "pending"] and $not($contains(name, "test"))',
      'JSONata'
    );

    expect(result.data).toEqual([
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [
          { field: 'status', operator: 'IN', value: ['open', 'pending'] },
          { field: 'name', operator: 'NOT_CONTAINS', value: 'test' },
        ],
      },
    ]);
  });

  it('keeps boolean rhs values as literals', () => {
    const result = parseQuery(
      'active = true and archived != false',
      'JSONata'
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
      'price >= cost and discount < max_discount and name = fallback_name and status != archived_status',
      'JSONata'
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

  it('does not collapse same-field field references into literal ranges', () => {
    const result = parseQuery(
      'price >= min_price and price <= max_price',
      'JSONata'
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
      'price < min_price or price > max_price',
      'JSONata'
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
      'price < 10 or price > 20',
      'JSONata'
    );

    expect(result.data).toEqual([
      { field: 'price', operator: 'NOT_BETWEEN', value: [10, 20] },
    ]);
  });

  it('still collapses literal ranges normally', () => {
    const result = parseQuery(
      'price >= 10 and price <= 20',
      'JSONata'
    );

    expect(result.data).toEqual([
      { field: 'price', operator: 'BETWEEN', value: [10, 20] },
    ]);
  });

  it('keeps string-helper parsing scoped to literal arguments', () => {
    const result = parseQuery(
      '$contains(profile.name, /^Al/) and profile.name = profile.display_name',
      'JSONata'
    );

    expect(result.data).toEqual([
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [
          { field: 'profile.name', operator: 'STARTS_WITH', value: 'Al' },
          {
            field: 'profile.name',
            operator: 'EQUAL',
            valueSource: 'field',
            valueField: 'profile.display_name',
          },
        ],
      },
    ]);
  });


  it('rejects computed rhs expressions that are outside the builder model', () => {
    expect(() =>
      parseQuery(
        'price > (cost * 1.2)',
        'JSONata'
      )
    ).toThrow(/Unexpected token/);
  });
});
