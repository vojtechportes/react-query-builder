import { parseRsql } from './parse-rsql';

describe('parse-rsql', () => {
  it('returns query data and inferred fields', () => {
    const result = parseRsql("name=='Alice'");

    expect(result.data).toEqual([
      { field: 'name', operator: 'EQUAL', value: 'Alice' },
    ]);
    expect(result.fields).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: 'name' })])
    );
  });
});
