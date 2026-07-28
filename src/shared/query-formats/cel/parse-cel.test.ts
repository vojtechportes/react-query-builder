import { parseCel } from './parse-cel';

describe('parse-cel', () => {
  it('returns query data and inferred fields', () => {
    const result = parseCel("name == 'Alice'");

    expect(result.data).toEqual([
      { field: 'name', operator: 'EQUAL', value: 'Alice' },
    ]);
    expect(result.fields).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: 'name' })])
    );
  });
});
