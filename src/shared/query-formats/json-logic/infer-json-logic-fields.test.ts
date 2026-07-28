import { inferJsonLogicFields } from './infer-json-logic-fields';

describe('infer-json-logic-fields', () => {
  it('infers the field used by a representative rule', () => {
    const fields = inferJsonLogicFields([
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
