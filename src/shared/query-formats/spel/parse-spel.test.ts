import { parseSpel } from './parse-spel';

describe('parse-spel', () => {
  it('returns query data and inferred fields', () => {
    const result = parseSpel("name == 'Alice'");

    expect(result.data).toEqual([
      { field: 'name', operator: 'EQUAL', value: 'Alice' },
    ]);
    expect(result.fields).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: 'name' })])
    );
  });
});
