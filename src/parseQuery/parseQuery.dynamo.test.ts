import { parseQuery } from './index';

describe('parseQuery Dynamo', () => {
  it('parses comparison, in, and boolean groups', () => {
    const result = parseQuery(
      "(status IN ('active', 'paused') AND age >= 18)",
      'Dynamo'
    );

    expect(result.data).toEqual([
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [
          { field: 'status', operator: 'IN', value: ['active', 'paused'] },
          { field: 'age', operator: 'LARGER_EQUAL', value: 18 },
        ],
      },
    ]);
  });

  it('parses functions, null checks, and not-between logic', () => {
    const result = parseQuery(
      "(contains(tags, 'pro') AND attribute_exists(status) AND (score < 10 OR score > 20))",
      'Dynamo'
    );

    expect(result.data).toEqual([
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [
          { field: 'tags', operator: 'CONTAINS', value: 'pro' },
          { field: 'status', operator: 'IS_NOT_NULL' },
          { field: 'score', operator: 'NOT_BETWEEN', value: [10, 20] },
        ],
      },
    ]);
  });

  it('parses field-to-field scalar comparisons and infers both fields', () => {
    const result = parseQuery(
      '(price >= cost AND discount < max_discount AND name = fallback_name AND status <> archived_status)',
      'Dynamo'
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

  it('does not collapse same-field field references into literal not-between operators', () => {
    const result = parseQuery(
      '(price < min_price OR price > max_price)',
      'Dynamo'
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
      '(price < 10 OR price > 20)',
      'Dynamo'
    );

    expect(result.data).toEqual([
      { field: 'price', operator: 'NOT_BETWEEN', value: [10, 20] },
    ]);
  });

  it('keeps function parsing scoped to literal arguments', () => {
    const result = parseQuery(
      "(begins_with(profile_name, 'Al') AND profile_name = display_name)",
      'Dynamo'
    );

    expect(result.data).toEqual([
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [
          { field: 'profile_name', operator: 'STARTS_WITH', value: 'Al' },
          {
            field: 'profile_name',
            operator: 'EQUAL',
            valueSource: 'field',
            valueField: 'display_name',
          },
        ],
      },
    ]);
  });
});
