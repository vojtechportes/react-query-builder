import { toDenormalizedDynamoQuery } from './to-denormalized-dynamo-node';

describe('to-denormalized-dynamo-node', () => {
  it('converts parsed groups into denormalized groups', () => {
    const result = (toDenormalizedDynamoQuery as (...args: any[]) => unknown)([
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
