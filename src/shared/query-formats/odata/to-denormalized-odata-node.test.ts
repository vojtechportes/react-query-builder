import { toDenormalizedODataQuery } from './to-denormalized-odata-node';

describe('to-denormalized-odata-node', () => {
  it('converts parsed groups into denormalized groups', () => {
    const result = (toDenormalizedODataQuery as (...args: any[]) => unknown)([
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
