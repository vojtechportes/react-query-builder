import { escapeElasticsearchWildcard, inferWildcardOperator } from './shared';

describe('shared', () => {
  it('escapes wildcards and infers contains patterns', () => {
    expect(escapeElasticsearchWildcard('a*b?')).toBe('a\\*b\\?');
    expect(inferWildcardOperator('*Ali*', false)).toEqual({
      operator: 'CONTAINS',
      value: 'Ali',
    });
  });
});
