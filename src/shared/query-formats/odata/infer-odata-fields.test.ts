import { inferODataFields } from './infer-odata-fields';

describe('infer-odata-fields', () => {
  it('infers the field used by a representative rule', () => {
    const fields = inferODataFields([
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
