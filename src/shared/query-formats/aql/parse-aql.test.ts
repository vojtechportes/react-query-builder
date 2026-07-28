import { parseAql } from './parse-aql';

describe('parse-aql', () => {
  it('returns query data and inferred fields', () => {
    const result = parseAql("doc.name == 'Alice'");

    expect(result.data).toEqual([
      { field: 'name', operator: 'EQUAL', value: 'Alice' },
    ]);
    expect(result.fields).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: 'name' })])
    );
  });
});
