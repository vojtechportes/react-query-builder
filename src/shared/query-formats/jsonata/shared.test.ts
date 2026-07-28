import { inferJsonataContainsOperator, quoteJsonataString } from './shared';

describe('shared', () => {
  it('quotes strings and infers contains patterns', () => {
    expect(quoteJsonataString("O'Reilly")).toBe('"O\'Reilly"');
    expect(inferJsonataContainsOperator('Ali', false)).toEqual({
      operator: 'CONTAINS',
      value: 'Ali',
    });
  });
});
