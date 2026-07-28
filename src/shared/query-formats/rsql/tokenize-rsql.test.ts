import { tokenizeRsql } from './tokenize-rsql';

describe('tokenize-rsql', () => {
  it('tokenizes identifiers and operators', () => {
    const tokenized = tokenizeRsql("name=='Alice'");
    const serialized = JSON.stringify(tokenized);

    expect(serialized).toContain('name');
    expect(serialized).toContain('EOF');
  });
});
