import type { ISqlSourceRange } from './sql-source-range';

describe('sql-source-range', () => {
  it('accepts a representative contract value', () => {
    const value: ISqlSourceRange = { start: 4, end: 8 };

    expect(value).toEqual({ start: 4, end: 8 });
  });
});
