import { toDenormalizedAqlQuery } from './to-denormalized-aql-node';

describe('to-denormalized-aql-node', () => {
  it('converts parsed groups into denormalized groups', () => {
    const result = (toDenormalizedAqlQuery as (...args: any[]) => unknown)([
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
