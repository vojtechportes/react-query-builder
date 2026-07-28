import { inferPrismaFields } from './infer-prisma-fields';

describe('infer-prisma-fields', () => {
  it('infers the field used by a representative rule', () => {
    const fields = inferPrismaFields([
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
