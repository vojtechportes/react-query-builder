import { DynamoParser } from './dynamo-parser';

describe('dynamo-parser', () => {
  it('parses a representative equality expression', () => {
    const nodes = new DynamoParser("name = 'Alice'").parse();

    expect(JSON.stringify(nodes)).toContain('name');
    expect(JSON.stringify(nodes)).toContain('EQUAL');
  });

  it('rejects an incomplete expression', () => {
    expect(() => new DynamoParser('name').parse()).toThrow();
  });
});
