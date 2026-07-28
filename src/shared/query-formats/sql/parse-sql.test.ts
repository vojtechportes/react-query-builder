import { parseSql } from './parse-sql';

describe('parse-sql', () => {
  it('returns query data and inferred fields', () => {
    const result = parseSql("name = 'Alice'");

    expect(result.data).toEqual([
      { field: 'name', operator: 'EQUAL', value: 'Alice' },
    ]);
    expect(result.fields).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: 'name' })])
    );
  });
});
