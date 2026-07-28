import { CelParser } from './cel-parser';

describe('cel-parser', () => {
  it('parses a representative equality expression', () => {
    const nodes = new CelParser("name == 'Alice'").parse();

    expect(JSON.stringify(nodes)).toContain('name');
    expect(JSON.stringify(nodes)).toContain('EQUAL');
  });

  it('rejects an incomplete expression', () => {
    expect(() => new CelParser('name').parse()).toThrow();
  });
});
