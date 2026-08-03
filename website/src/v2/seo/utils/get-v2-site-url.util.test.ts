import { afterEach, describe, expect, it, vi } from 'vitest';
import { getV2SiteUrl } from './get-v2-site-url.util';

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('getV2SiteUrl', () => {
  it('prefers the canonical origin over the deployment origin', () => {
    vi.stubEnv('VITE_SITE_URL', 'https://mirror.example.com/docs/');
    vi.stubEnv('VITE_CANONICAL_SITE_URL', 'https://www.example.com/');

    expect(getV2SiteUrl()).toBe('https://www.example.com/');
  });

  it('uses the deployment origin when no canonical override exists', () => {
    vi.stubEnv('VITE_SITE_URL', 'https://mirror.example.com/docs/');
    vi.stubEnv('VITE_CANONICAL_SITE_URL', '');

    expect(getV2SiteUrl()).toBe('https://mirror.example.com/docs/');
  });
});
