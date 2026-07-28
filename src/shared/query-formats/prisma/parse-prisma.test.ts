import { parsePrisma } from './parse-prisma';

describe('parse-prisma', () => {
  it('returns query data and inferred fields', () => {
    const result = parsePrisma('{"name":"Alice"}');

    expect(result.data).toEqual([
      { field: 'name', operator: 'EQUAL', value: 'Alice' },
    ]);
    expect(result.fields).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: 'name' })])
    );
  });
});
