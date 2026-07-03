import { parseQuery } from './index';

describe('parseQuery Mongo', () => {
  it('parses field operators, logical groups, and regex operators', () => {
    const result = parseQuery(
      JSON.stringify({
        $and: [
          { price: { $gte: 10, $lte: 20 } },
          { name: { $regex: '^Stev' } },
          {
            $nor: [{ archived_at: { $ne: null } }],
          },
        ],
      }),
      'Mongo'
    );

    expect(result.data).toEqual([
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [
          { field: 'price', operator: 'BETWEEN', value: [10, 20] },
          { field: 'name', operator: 'STARTS_WITH', value: 'Stev' },
          {
            type: 'GROUP',
            value: 'OR',
            isNegated: true,
            children: [{ field: 'archived_at', operator: 'IS_NOT_NULL' }],
          },
        ],
      },
    ]);
  });

  it('parses direct equality and mongo-specific array operators', () => {
    const result = parseQuery(
      JSON.stringify({
        status: 'active',
        tags: { $all: ['priority', 'b2b'] },
      }),
      'Mongo'
    );

    expect(result.data).toEqual([
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [
          { field: 'status', operator: 'EQUAL', value: 'active' },
          { field: 'tags', operator: 'ALL_IN', value: ['priority', 'b2b'] },
        ],
      },
    ]);
  });

  it('parses field-to-field scalar comparisons from $expr and infers both fields', () => {
    const result = parseQuery(
      JSON.stringify({
        $and: [
          { $expr: { $gte: ['$price', '$cost'] } },
          { $expr: { $lt: ['$discount', '$max_discount'] } },
          { $expr: { $eq: ['$name', '$fallback_name'] } },
          { $expr: { $ne: ['$status', '$archived_status'] } },
        ],
      }),
      'Mongo'
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

  it('rejects $expr expressions outside the builder field-to-field model', () => {
    expect(() =>
      parseQuery(
        JSON.stringify({
          $expr: { $gt: ['$price', 10] },
        }),
        'Mongo'
      )
    ).toThrow('Mongo $expr field-to-field comparisons must use field references on both sides.');
  });
  it('rejects $expr expressions with unsupported operators', () => {
    expect(() =>
      parseQuery(
        JSON.stringify({
          $expr: { $regexMatch: ['$name', '$pattern'] },
        }),
        'Mongo'
      )
    ).toThrow('Unsupported Mongo $expr operator "$regexMatch".');
  });

  it('rejects $expr expressions with the wrong operand count', () => {
    expect(() =>
      parseQuery(
        JSON.stringify({
          $expr: { $eq: ['$price', '$cost', '$extra'] },
        }),
        'Mongo'
      )
    ).toThrow('Mongo $expr operator "$eq" must contain two operands.');
  });

  it('rejects $expr expressions with multiple operators', () => {
    expect(() =>
      parseQuery(
        JSON.stringify({
          $expr: { $eq: ['$price', '$cost'], $gt: ['$price', '$min_price'] },
        }),
        'Mongo'
      )
    ).toThrow('Mongo $expr must contain exactly one comparison operator.');
  });
});

