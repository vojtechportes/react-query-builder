import { inferDjangoFields } from './infer-django-fields';

describe('infer-django-fields', () => {
  it('infers the field used by a representative rule', () => {
    const fields = inferDjangoFields([
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
