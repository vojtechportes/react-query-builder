import { parseQuery } from './index';

describe('parseQuery AQL', () => {
  it('parses a FILTER clause from a FOR query and strips the loop variable', () => {
    const result = parseQuery(
      'FOR doc IN customers FILTER doc.first_name LIKE "Stev%" AND doc.age >= 18 RETURN doc',
      'AQL'
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

  it('parses null checks, arrays, and negated groups', () => {
    const result = parseQuery(
      'FILTER status IN ["open", "pending"] AND NOT archived_at != null',
      'AQL'
    );

    expect(result.data).toEqual([
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [
          { field: 'status', operator: 'IN', value: ['open', 'pending'] },
          {
            type: 'GROUP',
            value: 'AND',
            isNegated: true,
            children: [{ field: 'archived_at', operator: 'IS_NOT_NULL' }],
          },
        ],
      },
    ]);
  });

  it('parses field-to-field scalar comparisons and infers both fields', () => {
    const result = parseQuery(
      'FILTER doc.price >= doc.cost AND doc.discount < doc.max_discount AND doc.name == doc.fallback_name AND doc.status != doc.archived_status',
      'AQL'
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
      'FILTER doc.price >= doc.min_price AND doc.price <= doc.max_price',
      'AQL'
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
      'FILTER doc.price < doc.min_price OR doc.price > doc.max_price',
      'AQL'
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
});
