import { describe, expect, it } from 'vitest';
import { getVersionSwitchHref } from './get-version-switch-href.util';

const targetRoutes = [
  '/',
  '/documentation',
  '/documentation/guides',
  '/api',
  '/recipes',
  '/v2-only',
];

describe('getVersionSwitchHref', () => {
  it.each([
    [
      'v2',
      '/documentation/guides',
      '?tab=api&tab=props',
      '#example%201',
      undefined,
      '/v2/documentation/guides?tab=api&tab=props#example%201',
    ],
    [
      'v1',
      '/v2-only/',
      '?draft=',
      '#result',
      '/react-query-builder/',
      '/react-query-builder/v1/v2-only?draft=#result',
    ],
    ['v2', '/', '', '', undefined, '/v2'],
  ] as const)(
    'preserves an equivalent route when switching to %s',
    (targetVersion, pathname, search, hash, basename, expected) => {
      expect(
        getVersionSwitchHref({
          basename,
          hash,
          pathname,
          search,
          targetRoutes,
          targetVersion,
        })
      ).toBe(expected);
    }
  );

  it.each([
    ['/documentation/guides/v1-only', '/v2/documentation/guides'],
    ['/documentation/v1-only', '/v2/documentation'],
    ['/api/v1-only', '/v2/api'],
    ['/unknown/v1-only', '/v2'],
  ])(
    'falls back from %s to the nearest owned landing',
    (pathname, expected) => {
      expect(
        getVersionSwitchHref({
          hash: '#discarded',
          pathname,
          search: '?discarded=true',
          targetRoutes,
          targetVersion: 'v2',
        })
      ).toBe(expected);
    }
  );

  it('uses the target route projection instead of assuming parity', () => {
    expect(
      getVersionSwitchHref({
        hash: '#details',
        pathname: '/v2-only',
        search: '?mode=full',
        targetRoutes,
        targetVersion: 'v2',
      })
    ).toBe('/v2/v2-only?mode=full#details');

    expect(
      getVersionSwitchHref({
        hash: '#details',
        pathname: '/v1-only',
        search: '?mode=full',
        targetRoutes,
        targetVersion: 'v2',
      })
    ).toBe('/v2');
  });
});
