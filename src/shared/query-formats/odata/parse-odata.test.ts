import { parseOData } from './parse-odata';

describe('parse-odata', () => {
  it('returns query data and inferred fields', () => {
    const result = parseOData("name eq 'Alice'");

    expect(result.data).toEqual([
      { field: 'name', operator: 'EQUAL', value: 'Alice' },
    ]);
    expect(result.fields).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: 'name' })])
    );
  });
});
