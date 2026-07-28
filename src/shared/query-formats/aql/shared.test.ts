import { escapeAqlString, quoteAqlIdentifier } from './shared';

describe('shared', () => {
  it('escapes strings and quotes nested identifiers', () => {
    expect(escapeAqlString('a"b')).toBe(String.raw`a\"b`);
    expect(quoteAqlIdentifier('profile.name', 'item')).toBe(
      'item.profile.name'
    );
  });
});
