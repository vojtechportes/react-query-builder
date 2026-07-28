import { tokenizeCel } from './tokenize-cel';

describe('tokenize-cel', () => {
  it('tokenizes identifiers and operators', () => {
    const tokenized = tokenizeCel("name == 'Alice'");
    const serialized = JSON.stringify(tokenized);

    expect(serialized).toContain('name');
    expect(serialized).toContain('EOF');
  });
});
