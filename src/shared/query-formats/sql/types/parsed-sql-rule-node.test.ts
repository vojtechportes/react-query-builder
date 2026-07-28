import type { IParsedSqlRuleNode } from './parsed-sql-rule-node';

describe('parsed-sql-rule-node', () => {
  it('accepts a representative contract value', () => {
    const value: IParsedSqlRuleNode = {
      field: 'name',
      operator: 'EQUAL',
      value: 'Alice',
      source: { field: { start: 0, end: 4 } },
    };

    expect(value).toEqual({
      field: 'name',
      operator: 'EQUAL',
      value: 'Alice',
      source: { field: { start: 0, end: 4 } },
    });
  });
});
