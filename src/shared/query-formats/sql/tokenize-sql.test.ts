import { tokenizeSql } from './tokenize-sql';

describe('tokenize-sql', () => {
  it('tokenizes identifiers and operators', () => {
    const tokenized = tokenizeSql("name = 'Alice'");
    const serialized = JSON.stringify(tokenized);

    expect(serialized).toContain('name');
    expect(serialized).toContain('EOF');
  });
});
