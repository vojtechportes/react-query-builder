import { JsonataParser } from './jsonata-parser';

describe('jsonata-parser', () => {
  it('parses a representative equality expression', () => {
    const nodes = new JsonataParser("name = 'Alice'").parse();

    expect(JSON.stringify(nodes)).toContain('name');
    expect(JSON.stringify(nodes)).toContain('EQUAL');
  });

  it('rejects an incomplete expression', () => {
    expect(() => new JsonataParser('name').parse()).toThrow();
  });
});
