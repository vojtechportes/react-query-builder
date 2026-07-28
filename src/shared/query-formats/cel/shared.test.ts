import { inferCelMatchesOperator, quoteCelString } from './shared';

describe('shared', () => {
  it('quotes strings and infers wildcard operators', () => {
    expect(quoteCelString('Alice')).toBe('"Alice"');
    expect(inferCelMatchesOperator('Ali')).toEqual({
      operator: 'CONTAINS',
      value: 'Ali',
    });
  });
});
