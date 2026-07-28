import { tryParseSql } from './try-parse-sql';

describe('try-parse-sql', () => {
  it('returns parsed data without diagnostics for valid SQL', () => {
    const result = tryParseSql("name = 'Alice'");

    expect(result.data).toEqual([
      { field: 'name', operator: 'EQUAL', value: 'Alice' },
    ]);
    expect(result.diagnostics).toEqual([]);
  });

  it('returns a diagnostic instead of throwing for invalid SQL', () => {
    const result = tryParseSql('name =');

    expect(result.data).toBeUndefined();
    expect(result.diagnostics[0]).toEqual(
      expect.objectContaining({ message: expect.any(String) })
    );
  });
});
