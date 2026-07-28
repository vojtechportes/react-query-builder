import { parseMongoExpression } from './parse-mongo-expression';

describe('parse-mongo-expression', () => {
  it('parses a representative equality expression', () => {
    expect(parseMongoExpression({ name: 'Alice' })).toEqual([
      { field: 'name', operator: 'EQUAL', value: 'Alice' },
    ]);
  });

  it('rejects unsupported input', () => {
    expect(() => parseMongoExpression(null as never)).toThrow();
  });
});
