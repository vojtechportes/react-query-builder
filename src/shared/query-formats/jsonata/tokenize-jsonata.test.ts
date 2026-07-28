import { tokenizeJsonata } from './tokenize-jsonata';

describe('tokenize-jsonata', () => {
  it('tokenizes identifiers and operators', () => {
    const tokenized = tokenizeJsonata("name = 'Alice'");
    const serialized = JSON.stringify(tokenized);

    expect(serialized).toContain('name');
    expect(serialized).toContain('EOF');
  });
});
