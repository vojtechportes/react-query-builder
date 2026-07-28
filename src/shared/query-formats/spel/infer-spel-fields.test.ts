import { inferSpelFields } from './infer-spel-fields';

describe('infer-spel-fields', () => {
  it('infers the field used by a representative rule', () => {
    const fields = inferSpelFields([
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
