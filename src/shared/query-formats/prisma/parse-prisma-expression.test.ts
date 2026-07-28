import { parsePrismaExpression } from './parse-prisma-expression';

describe('parse-prisma-expression', () => {
  it('parses a representative equality expression', () => {
    expect(parsePrismaExpression({ name: 'Alice' })).toEqual([
      { field: 'name', operator: 'EQUAL', value: 'Alice' },
    ]);
  });

  it('rejects unsupported input', () => {
    expect(() => parsePrismaExpression(null as never)).toThrow();
  });
});
