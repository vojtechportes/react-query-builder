import { createSqlDiagnostic } from './create-sql-diagnostic';

describe('create-sql-diagnostic', () => {
  it('creates a diagnostic with its source range', () => {
    expect(
      createSqlDiagnostic('missing_value', 'Missing value.', 4, 8)
    ).toEqual({
      code: 'missing_value',
      message: 'Missing value.',
      start: 4,
      end: 8,
    });
  });
});
