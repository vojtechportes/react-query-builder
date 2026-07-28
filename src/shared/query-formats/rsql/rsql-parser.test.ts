import { RsqlParser } from './rsql-parser';

describe('rsql-parser', () => {
  it('parses a representative equality expression', () => {
    const nodes = new RsqlParser("name=='Alice'").parse();

    expect(JSON.stringify(nodes)).toContain('name');
    expect(JSON.stringify(nodes)).toContain('EQUAL');
  });

  it('rejects an incomplete expression', () => {
    expect(() => new RsqlParser('name').parse()).toThrow();
  });
});
