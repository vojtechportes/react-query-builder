import { getMissingSqlTokenMessage } from './get-missing-sql-token-message';

describe('get-missing-sql-token-message', () => {
  it('returns focused and fallback token messages', () => {
    expect(getMissingSqlTokenMessage('RPAREN')).toBe(
      'Missing closing parenthesis.'
    );
    expect(getMissingSqlTokenMessage('BOOLEAN')).toBe(
      'Missing token "BOOLEAN".'
    );
  });
});
