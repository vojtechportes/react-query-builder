import { tokenizeOData } from './tokenize-odata';

describe('tokenize-odata', () => {
  it('tokenizes identifiers and operators', () => {
    const tokenized = tokenizeOData("name eq 'Alice'");
    const serialized = JSON.stringify(tokenized);

    expect(serialized).toContain('name');
    expect(serialized).toContain('EOF');
  });
});
