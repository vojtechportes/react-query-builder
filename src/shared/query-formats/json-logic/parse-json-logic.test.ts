import { parseJsonLogic } from './parse-json-logic';

describe('parse-json-logic', () => {
  it('returns query data and inferred fields', () => {
    const result = parseJsonLogic('{"==":[{"var":"name"},"Alice"]}');

    expect(result.data).toEqual([
      { field: 'name', operator: 'EQUAL', value: 'Alice' },
    ]);
    expect(result.fields).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: 'name' })])
    );
  });
});
