import { inferDynamoFields } from './infer-dynamo-fields';

describe('infer-dynamo-fields', () => {
  it('infers the field used by a representative rule', () => {
    const fields = inferDynamoFields([
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [{ field: 'name', operator: 'EQUAL', value: 'Alice' }],
      },
    ]);

    expect(fields).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: 'name' })])
    );
  });
});
