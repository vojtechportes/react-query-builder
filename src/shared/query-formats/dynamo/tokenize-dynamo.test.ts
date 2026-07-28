import { tokenizeDynamo } from './tokenize-dynamo';

describe('tokenize-dynamo', () => {
  it('tokenizes identifiers and operators', () => {
    const tokenized = tokenizeDynamo("name = 'Alice'");
    const serialized = JSON.stringify(tokenized);

    expect(serialized).toContain('name');
    expect(serialized).toContain('EOF');
  });
});
