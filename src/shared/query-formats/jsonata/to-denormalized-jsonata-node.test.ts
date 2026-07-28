import { toDenormalizedJsonataQuery } from './to-denormalized-jsonata-node';

describe('to-denormalized-jsonata-node', () => {
  it('converts parsed groups into denormalized groups', () => {
    const result = (toDenormalizedJsonataQuery as (...args: any[]) => unknown)([
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
