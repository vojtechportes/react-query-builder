import { describe, expect, it } from 'vitest';
import { createRouteRedirectDocument } from './create-route-redirect-document.util';

describe('createRouteRedirectDocument', () => {
  it('creates a noindex redirect document with a static fallback', () => {
    const document = createRouteRedirectDocument('/v2/documentation');

    expect(document).toContain('<meta name="robots" content="noindex" />');
    expect(document).toContain(
      '<meta http-equiv="refresh" content="0;url=/v2/documentation" />'
    );
    expect(document).toContain('href="/v2/documentation"');
  });

  it('preserves runtime query strings and hashes', () => {
    const document = createRouteRedirectDocument('/v2/api/builder');

    expect(document).toContain(
      'window.location.replace("/v2/api/builder" + window.location.search + window.location.hash);'
    );
  });

  it('escapes destinations in HTML and script contexts', () => {
    const document = createRouteRedirectDocument('/v2/docs?<unsafe>');

    expect(document).toContain('/v2/docs?&lt;unsafe&gt;');
    expect(document).toContain('"/v2/docs?\\u003cunsafe>"');
    expect(document).not.toContain('"/v2/docs?<unsafe>"');
  });
});
