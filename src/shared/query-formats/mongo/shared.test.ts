import { createMongoFieldReference, parseMongoFieldReference } from './shared';

describe('shared', () => {
  it('creates and parses field references', () => {
    expect(createMongoFieldReference('profile.name')).toBe('$profile.name');
    expect(parseMongoFieldReference('$profile.name')).toBe('profile.name');
    expect(parseMongoFieldReference('profile.name')).toBeNull();
  });
});
