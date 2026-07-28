import { createSqlParseError } from './create-sql-parse-error';

describe('create-sql-parse-error', () => {
  it('attaches a structured diagnostic to the error', () => {
    const error = createSqlParseError('missing_value', 'Missing value.', 4, 8);

    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe('Missing value.');
    expect(error.diagnostic).toEqual({
      code: 'missing_value',
      message: 'Missing value.',
      start: 4,
      end: 8,
    });
  });
});
