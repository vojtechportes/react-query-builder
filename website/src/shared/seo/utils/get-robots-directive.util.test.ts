import { afterEach, describe, expect, it, vi } from 'vitest';
import { getRobotsDirective } from './get-robots-directive.util';

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('getRobotsDirective', () => {
  it('uses the configured deployment policy when present', () => {
    vi.stubEnv('VITE_ROBOTS_DIRECTIVE', 'noindex,nofollow');

    expect(getRobotsDirective('index,follow')).toBe('noindex,nofollow');
  });

  it('uses the version default without a deployment override', () => {
    vi.stubEnv('VITE_ROBOTS_DIRECTIVE', '');

    expect(getRobotsDirective('index,follow')).toBe('index,follow');
  });
});
