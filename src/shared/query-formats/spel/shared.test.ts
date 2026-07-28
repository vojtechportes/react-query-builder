import { inferSpelMatchesOperator, quoteSpelString } from './shared';

describe('shared', () => {
  it('quotes strings and infers match operators', () => {
    expect(quoteSpelString("O'Reilly")).toBe("'O''Reilly'");
    expect(inferSpelMatchesOperator('Ali')).toEqual({
      operator: 'CONTAINS',
      value: 'Ali',
    });
  });
});
