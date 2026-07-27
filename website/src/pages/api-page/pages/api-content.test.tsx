import { describe, expect, it } from 'vitest';
import { findApiPage } from './api-content';

describe('findApiPage', () => {
  it('finds an API page when the pathname has a trailing slash', () => {
    expect(findApiPage('/api/builder/').path).toBe('/api/builder');
  });
});
