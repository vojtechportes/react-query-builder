import { getMissingSqlKeywordMessage } from './get-missing-sql-keyword-message';

describe('get-missing-sql-keyword-message', () => {
  it('returns focused and fallback keyword messages', () => {
    expect(getMissingSqlKeywordMessage('AND')).toBe('Missing AND keyword.');
    expect(getMissingSqlKeywordMessage('ESCAPE')).toBe(
      'Missing keyword "ESCAPE".'
    );
  });
});
