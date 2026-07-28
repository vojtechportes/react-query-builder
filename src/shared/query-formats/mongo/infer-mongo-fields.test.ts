import { inferMongoFields } from './infer-mongo-fields';

describe('infer-mongo-fields', () => {
  it('infers the field used by a representative rule', () => {
    const fields = inferMongoFields([
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
