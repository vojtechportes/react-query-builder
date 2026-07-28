import type { ISqlDiagnostic } from './sql-diagnostic';

describe('sql-diagnostic', () => {
  it('accepts a representative contract value', () => {
    const value: ISqlDiagnostic = {
      code: 'missing_value',
      message: 'Missing value.',
      start: 4,
      end: 8,
    };

    expect(value).toEqual({
      code: 'missing_value',
      message: 'Missing value.',
      start: 4,
      end: 8,
    });
  });
});
