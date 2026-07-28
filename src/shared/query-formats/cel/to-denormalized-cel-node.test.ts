import { toDenormalizedCelQuery } from './to-denormalized-cel-node';

describe('to-denormalized-cel-node', () => {
  it('converts parsed groups into denormalized groups', () => {
    const result = (toDenormalizedCelQuery as (...args: any[]) => unknown)([
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
