import { inferODataStringOperator, quoteODataString } from './shared';

describe('shared', () => {
  it('quotes strings and maps string functions', () => {
    expect(quoteODataString("O'Reilly")).toBe("'O''Reilly'");
    expect(inferODataStringOperator('contains', 'Ali')).toEqual({
      operator: 'CONTAINS',
      value: 'Ali',
    });
  });
});
