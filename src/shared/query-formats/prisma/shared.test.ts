import {
  createPrismaFieldReference,
  parsePrismaFieldReference,
} from './shared';

describe('shared', () => {
  it('creates and parses field references', () => {
    const reference = createPrismaFieldReference('profile.name');

    expect(reference).toEqual({ $ref: 'profile.name' });
    expect(parsePrismaFieldReference(reference)).toBe('profile.name');
    expect(parsePrismaFieldReference('profile.name')).toBeNull();
  });
});
