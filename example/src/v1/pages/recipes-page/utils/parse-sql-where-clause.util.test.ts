import { describe, expect, it } from 'vitest';
import { parseSqlWhereClause } from './parse-sql-where-clause.util';

describe('parseSqlWhereClause', () => {
  it('accepts a full WHERE clause or a predicate expression', () => {
    expect(parseSqlWhereClause("WHERE status = 'PAID'").data).toEqual(
      parseSqlWhereClause("status = 'PAID'").data
    );
  });

  it('surfaces parser errors for incomplete SQL', () => {
    expect(() => parseSqlWhereClause('WHERE status =')).toThrow();
  });
});
