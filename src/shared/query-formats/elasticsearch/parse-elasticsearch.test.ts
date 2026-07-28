import { parseElasticsearch } from './parse-elasticsearch';

describe('parse-elasticsearch', () => {
  it('returns query data and inferred fields', () => {
    const result = parseElasticsearch('{"term":{"name":"Alice"}}');

    expect(result.data).toEqual([
      { field: 'name', operator: 'EQUAL', value: 'Alice' },
    ]);
    expect(result.fields).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: 'name' })])
    );
  });
});
