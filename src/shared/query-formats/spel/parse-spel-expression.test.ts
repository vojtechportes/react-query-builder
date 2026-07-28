import { parseSpelExpression } from './parse-spel-expression';

describe('parse-spel-expression', () => {
  it('parses a representative equality expression', () => {
    expect(parseSpelExpression("name == 'Alice'")).toEqual([
      { field: 'name', operator: 'EQUAL', value: 'Alice' },
    ]);
  });

  it('rejects unsupported input', () => {
    expect(() => parseSpelExpression(null as never)).toThrow();
  });
});
