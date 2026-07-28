import type { IParsedSqlRuleSource } from './parsed-sql-rule-source';

describe('parsed-sql-rule-source', () => {
  it('accepts a representative contract value', () => {
    const value: IParsedSqlRuleSource = {
      field: { start: 0, end: 4 },
      operator: { start: 5, end: 6 },
    };

    expect(value).toEqual({
      field: { start: 0, end: 4 },
      operator: { start: 5, end: 6 },
    });
  });
});
