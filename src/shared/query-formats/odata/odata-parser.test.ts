import { ODataParser } from './odata-parser';

describe('odata-parser', () => {
  it('parses a representative equality expression', () => {
    const nodes = new ODataParser("name eq 'Alice'").parse();

    expect(JSON.stringify(nodes)).toContain('name');
    expect(JSON.stringify(nodes)).toContain('EQUAL');
  });

  it('rejects an incomplete expression', () => {
    expect(() => new ODataParser('name').parse()).toThrow();
  });
});
