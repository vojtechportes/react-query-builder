import { tokenizeAql } from './tokenize-aql';

describe('tokenize-aql', () => {
  it('tokenizes identifiers and operators', () => {
    const tokenized = tokenizeAql("doc.name == 'Alice'");
    const serialized = JSON.stringify(tokenized);

    expect(serialized).toContain('name');
    expect(serialized).toContain('EOF');
  });
});
