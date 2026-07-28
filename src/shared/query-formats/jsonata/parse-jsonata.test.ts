import { parseJsonata } from './parse-jsonata';

describe('parse-jsonata', () => {
  it('returns query data and inferred fields', () => {
    const result = parseJsonata("name = 'Alice'");

    expect(result.data).toEqual([
      { field: 'name', operator: 'EQUAL', value: 'Alice' },
    ]);
    expect(result.fields).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: 'name' })])
    );
  });
});
