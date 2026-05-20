import type { DenormalizedQuery } from '../utils/query-tree';
import { formatQuery } from './index';

describe('formatQuery Prisma', () => {
  it('formats root-level rules with the configured combinator', () => {
    const query: DenormalizedQuery = [
      { field: 'price', operator: 'LARGER', value: 10 },
      { field: 'active', operator: 'EQUAL', value: true },
    ];

    expect(formatQuery(query, 'Prisma', { rootlessCombinator: 'OR' })).toEqual(
      JSON.stringify(
        {
          OR: [{ price: { gt: 10 } }, { active: true }],
        },
        null,
        2
      )
    );
  });

  it('formats where wrapper and string operators', () => {
    const query: DenormalizedQuery = [
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [
          { field: 'name', operator: 'STARTS_WITH', value: 'Stev' },
          { field: 'age', operator: 'BETWEEN', value: [18, 30] },
        ],
      },
    ];

    expect(
      formatQuery(query, 'Prisma', { wrapWhereClause: true })
    ).toEqual(
      JSON.stringify(
        {
          where: {
            AND: [
              { name: { startsWith: 'Stev' } },
              { age: { gte: 18, lte: 30 } },
            ],
          },
        },
        null,
        2
      )
    );
  });
});
