import { describe, expect, it } from 'vitest';
import { findDocumentationPage } from './documentation-content';

describe('findDocumentationPage', () => {
  it('finds a documentation page when the pathname has a trailing slash', () => {
    expect(
      findDocumentationPage('/documentation/dynamic-field-options/').path
    ).toBe('/documentation/dynamic-field-options');
  });
});
