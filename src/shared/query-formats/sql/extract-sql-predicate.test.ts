import { extractSqlPredicate } from './extract-sql-predicate';

describe('extract-sql-predicate', () => {
  it('extracts the predicate before a trailing SQL clause', () => {
    expect(
      extractSqlPredicate(
        "SELECT * FROM users WHERE name = 'Alice' ORDER BY name"
      )
    ).toBe("name = 'Alice'");
  });

  it('does not treat clause text inside a string as a boundary', () => {
    expect(extractSqlPredicate("name = 'ORDER BY'")).toBe("name = 'ORDER BY'");
  });
});
