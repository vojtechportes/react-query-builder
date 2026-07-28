import { inferAqlFields } from './infer-aql-fields';

describe('infer-aql-fields', () => {
  it('infers the field used by a representative rule', () => {
    const fields = inferAqlFields([
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
