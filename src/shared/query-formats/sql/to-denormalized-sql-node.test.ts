import { toDenormalizedSqlQuery } from './to-denormalized-sql-node';

describe('to-denormalized-sql-node', () => {
  it('converts parsed groups into denormalized groups', () => {
    const result = (toDenormalizedSqlQuery as (...args: any[]) => unknown)([
      {
        kind: 'group',
        combinator: 'AND',
        isNegated: true,
        children: [{ field: 'name', operator: 'EQUAL', value: 'Alice' }],
      },
    ]);

    expect(result).toEqual([
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: true,
        children: [{ field: 'name', operator: 'EQUAL', value: 'Alice' }],
      },
    ]);
  });
});
