import { AqlParser } from './aql-parser';

describe('aql-parser', () => {
  it('parses a representative equality expression', () => {
    const nodes = new AqlParser("doc.name == 'Alice'").parse();

    expect(JSON.stringify(nodes)).toContain('name');
    expect(JSON.stringify(nodes)).toContain('EQUAL');
  });

  it('rejects an incomplete expression', () => {
    expect(() => new AqlParser('name').parse()).toThrow();
  });
});
