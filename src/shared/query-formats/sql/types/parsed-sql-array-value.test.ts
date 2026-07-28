import type { IParsedSqlArrayValue } from './parsed-sql-array-value';

describe('parsed-sql-array-value', () => {
  it('accepts a representative contract value', () => {
    const value: IParsedSqlArrayValue = {
      value: ['active'],
      range: { start: 0, end: 10 },
      values: [{ start: 1, end: 9 }],
    };

    expect(value).toEqual({
      value: ['active'],
      range: { start: 0, end: 10 },
      values: [{ start: 1, end: 9 }],
    });
  });
});
