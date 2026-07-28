import { tokenizeDjango } from './tokenize-django';

describe('tokenize-django', () => {
  it('tokenizes identifiers and operators', () => {
    const tokenized = tokenizeDjango("Q(name='Alice')");
    const serialized = JSON.stringify(tokenized);

    expect(serialized).toContain('name');
    expect(serialized).toContain('EOF');
  });
});
