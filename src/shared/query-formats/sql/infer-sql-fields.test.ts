import { inferSqlFields } from './infer-sql-fields';

describe('infer-sql-fields', () => {
  it('infers the field used by a representative rule', () => {
    const fields = inferSqlFields([
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
