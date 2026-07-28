import { isSqlRuleFormattable } from './is-sql-rule-formattable';

describe('is-sql-rule-formattable', () => {
  it('accepts complete scalar and null rules', () => {
    expect(
      isSqlRuleFormattable({ field: 'name', operator: 'EQUAL', value: 'Alice' })
    ).toBe(true);
    expect(
      isSqlRuleFormattable({ field: 'deletedAt', operator: 'IS_NULL' })
    ).toBe(true);
  });

  it('rejects missing and incomplete range values', () => {
    expect(
      isSqlRuleFormattable({ field: '', operator: 'EQUAL', value: 1 })
    ).toBe(false);
    expect(
      isSqlRuleFormattable({ field: 'age', operator: 'BETWEEN', value: [18] })
    ).toBe(false);
  });
});
