import { toDenormalizedRsqlQuery } from './to-denormalized-rsql-node';

describe('to-denormalized-rsql-node', () => {
  it('converts parsed groups into denormalized groups', () => {
    const result = (toDenormalizedRsqlQuery as (...args: any[]) => unknown)([
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
