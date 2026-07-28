import { coerceSqlArrayValue } from './coerce-sql-array-value';

describe('coerce-sql-array-value', () => {
  it('keeps arrays and wraps scalar values', () => {
    expect(coerceSqlArrayValue(['active', 'paused'])).toEqual([
      'active',
      'paused',
    ]);
    expect(coerceSqlArrayValue('active')).toEqual(['active']);
    expect(coerceSqlArrayValue(3)).toEqual([3]);
  });

  it('rejects unsupported values', () => {
    expect(coerceSqlArrayValue({ value: 'active' })).toBeNull();
  });
});
