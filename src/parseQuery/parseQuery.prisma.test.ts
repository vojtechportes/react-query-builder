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
});
