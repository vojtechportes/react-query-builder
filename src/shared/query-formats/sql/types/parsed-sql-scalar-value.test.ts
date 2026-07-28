import type { IParsedSqlScalarValue } from './parsed-sql-scalar-value';

describe('parsed-sql-scalar-value', () => {
  it('accepts a representative contract value', () => {
    const value: IParsedSqlScalarValue = {
      value: 'Alice',
      range: { start: 0, end: 7 },
    };

    expect(value).toEqual({ value: 'Alice', range: { start: 0, end: 7 } });
  });
});
