import { SqlParser } from './sql-parser';

describe('sql-parser', () => {
  it('parses a representative equality expression', () => {
    const nodes = new SqlParser("name = 'Alice'").parse();

    expect(JSON.stringify(nodes)).toContain('name');
    expect(JSON.stringify(nodes)).toContain('EQUAL');
  });

  it('rejects an incomplete expression', () => {
    expect(() => new SqlParser('name').parse()).toThrow();
  });
});
