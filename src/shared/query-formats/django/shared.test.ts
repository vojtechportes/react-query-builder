import { formatDjangoFieldReference, quoteDjangoString } from './shared';

describe('shared', () => {
  it('quotes strings and creates field references', () => {
    expect(quoteDjangoString("O'Reilly")).toBe("'O\\'Reilly'");
    expect(formatDjangoFieldReference('profile.name')).toBe(
      "F('profile.name')"
    );
  });
});
