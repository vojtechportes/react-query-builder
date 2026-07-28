import { inferJsonataFields } from './infer-jsonata-fields';

describe('infer-jsonata-fields', () => {
  it('infers the field used by a representative rule', () => {
    const fields = inferJsonataFields([
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
