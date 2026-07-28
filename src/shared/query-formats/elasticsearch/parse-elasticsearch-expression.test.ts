import { parseElasticsearchExpression } from './parse-elasticsearch-expression';

describe('parse-elasticsearch-expression', () => {
  it('parses a representative equality expression', () => {
    expect(parseElasticsearchExpression({ term: { name: 'Alice' } })).toEqual([
      { field: 'name', operator: 'EQUAL', value: 'Alice' },
    ]);
  });

  it('rejects unsupported input', () => {
    expect(() => parseElasticsearchExpression(null as never)).toThrow();
  });
});
