import { inferRsqlFields } from './infer-rsql-fields';

describe('infer-rsql-fields', () => {
  it('infers the field used by a representative rule', () => {
    const fields = inferRsqlFields([
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
