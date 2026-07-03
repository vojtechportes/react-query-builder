import { parseQuery } from './index';

describe('parseQuery Prisma', () => {
  it('parses where groups, range, startsWith, and null checks', () => {
    const result = parseQuery(
      JSON.stringify({
        where: {
          AND: [
            { price: { gte: 10, lte: 20 } },
            { name: { startsWith: 'Stev' } },
            { archivedAt: { not: null } },
          ],
        },
      }),
      'Prisma'
    );

    expect(result.data).toEqual([
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [
          { field: 'price', operator: 'BETWEEN', value: [10, 20] },
          { field: 'name', operator: 'STARTS_WITH', value: 'Stev' },
          { field: 'archivedAt', operator: 'IS_NOT_NULL' },
        ],
      },
    ]);
  });

  it('parses direct equality and prisma-specific array operators', () => {
    const result = parseQuery(
      JSON.stringify({
        status: 'active',
        tags: { hasEvery: ['priority', 'b2b'] },
      }),
      'Prisma'
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

  it('parses field-to-field scalar comparisons and infers both fields', () => {
    const result = parseQuery(
      JSON.stringify({
        AND: [
          { price: { gte: { $ref: 'cost' } } },
          { discount: { lt: { $ref: 'max_discount' } } },
          { name: { equals: { $ref: 'fallback_name' } } },
          { status: { not: { $ref: 'archived_status' } } },
        ],
      }),
      'Prisma'
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

  it('still collapses literal not-between ranges normally', () => {
    const result = parseQuery(
      JSON.stringify({
        OR: [{ price: { lt: 10 } }, { price: { gt: 20 } }],
      }),
      'Prisma'
    );

    expect(result.data).toEqual([
      { field: 'price', operator: 'NOT_BETWEEN', value: [10, 20] },
    ]);
  });

  it('does not collapse field references into literal range operators', () => {
    const betweenResult = parseQuery(
      JSON.stringify({
        price: {
          gte: { $ref: 'min_price' },
          lte: { $ref: 'max_price' },
        },
      }),
      'Prisma'
    );

    expect(betweenResult.data).toEqual([
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

    const notBetweenResult = parseQuery(
      JSON.stringify({
        OR: [
          { price: { lt: { $ref: 'min_price' } } },
          { price: { gt: { $ref: 'max_price' } } },
        ],
      }),
      'Prisma'
    );

    expect(notBetweenResult.data).toEqual([
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
