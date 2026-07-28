import { getSqlParserString } from './get-sql-parser-string';

describe('get-sql-parser-string', () => {
  it('uses localized templates and applies replacements', () => {
    const strings = {
      sql: { missingKeyword: 'Keyword {keyword} is required.' },
    };

    expect(
      getSqlParserString(
        strings as never,
        'missingKeyword',
        'Missing {keyword}.',
        { keyword: 'AND' }
      )
    ).toBe('Keyword AND is required.');
  });

  it('uses the fallback when localization is unavailable', () => {
    expect(
      getSqlParserString(undefined, 'missingKeyword', 'Missing {keyword}.', {
        keyword: 'AND',
      })
    ).toBe('Missing AND.');
  });
});
