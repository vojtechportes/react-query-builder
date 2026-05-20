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
});

