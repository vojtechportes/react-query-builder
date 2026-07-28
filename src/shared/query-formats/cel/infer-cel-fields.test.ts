import { inferCelFields } from './infer-cel-fields';

describe('infer-cel-fields', () => {
  it('infers the field used by a representative rule', () => {
    const fields = inferCelFields([
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
