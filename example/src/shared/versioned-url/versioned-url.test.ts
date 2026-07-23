import { describe, expect, it } from 'vitest';
import { addVersionPrefix } from './utils/add-version-prefix.util';
import { normalizeBasename } from './utils/normalize-basename.util';
import { parseVersionedUrl } from './utils/parse-versioned-url.util';
import { removeVersionPrefix } from './utils/remove-version-prefix.util';
import { switchVersionPrefix } from './utils/switch-version-prefix.util';

describe('versioned URL helpers', () => {
  it.each([
    {
      label: 'an unversioned production root',
      url: '/',
      basename: undefined,
      expected: {
        basename: '',
        version: undefined,
        pathname: '/',
        search: '',
        hash: '',
      },
    },
    {
      label: 'a version root without a trailing slash',
      url: '/v1',
      basename: '/',
      expected: {
        basename: '',
        version: 'v1',
        pathname: '/',
        search: '',
        hash: '',
      },
    },
    {
      label: 'a version root with a trailing slash',
      url: '/v2/',
      basename: undefined,
      expected: {
        basename: '',
        version: 'v2',
        pathname: '/',
        search: '',
        hash: '',
      },
    },
    {
      label: 'a deep repository URL',
      url: '/react-query-builder/v1/documentation/usage',
      basename: '/react-query-builder/',
      expected: {
        basename: '/react-query-builder',
        version: 'v1',
        pathname: '/documentation/usage',
        search: '',
        hash: '',
      },
    },
    {
      label: 'an unknown route with an encoded suffix',
      url: '/repo/v2/unknown/deep?filter=a%2Fb&filter=c#rule%201',
      basename: 'repo',
      expected: {
        basename: '/repo',
        version: 'v2',
        pathname: '/unknown/deep',
        search: '?filter=a%2Fb&filter=c',
        hash: '#rule%201',
      },
    },
    {
      label: 'a path outside the configured basename',
      url: '/other/v1/docs?preview=#heading',
      basename: '/repo',
      expected: {
        basename: '/repo',
        version: undefined,
        pathname: '/other/v1/docs',
        search: '?preview=',
        hash: '#heading',
      },
    },
    {
      label: 'a basename lookalike',
      url: '/react-query-builderish/v1/docs',
      basename: '/react-query-builder',
      expected: {
        basename: '/react-query-builder',
        version: undefined,
        pathname: '/react-query-builderish/v1/docs',
        search: '',
        hash: '',
      },
    },
    {
      label: 'a prefix lookalike',
      url: '/repo/v10/docs?next=/v1#v2',
      basename: '/repo',
      expected: {
        basename: '/repo',
        version: undefined,
        pathname: '/v10/docs',
        search: '?next=/v1',
        hash: '#v2',
      },
    },
  ])('parses $label', ({ url, basename, expected }) => {
    expect(parseVersionedUrl(url, basename)).toEqual(expected);
  });

  it.each([
    ['/', 'v1', undefined, '/v1'],
    ['/documentation/usage', 'v2', '/', '/v2/documentation/usage'],
    [
      '/documentation/usage?tab=api',
      'v2',
      '/',
      '/v2/documentation/usage?tab=api',
    ],
    [
      '/react-query-builder/unknown/deep?draft=&draft=2#results',
      'v1',
      '/react-query-builder/',
      '/react-query-builder/v1/unknown/deep?draft=&draft=2#results',
    ],
    ['/v1/docs?version=/v2#v1', 'v1', undefined, '/v1/docs?version=/v2#v1'],
    ['/v1/docs', 'v2', undefined, '/v1/docs'],
  ] as const)(
    'adds a prefix to %s for %s with basename %s',
    (url, version, basename, expected) => {
      expect(addVersionPrefix(url, version, basename)).toBe(expected);
    }
  );

  it.each([
    ['/v1', undefined, '/'],
    ['/v2/', '/', '/'],
    [
      '/v1/documentation/usage?tab=api#example',
      undefined,
      '/documentation/usage?tab=api#example',
    ],
    [
      '/react-query-builder/v2/unknown/deep?value=a%2Fb#result',
      '/react-query-builder/',
      '/react-query-builder/unknown/deep?value=a%2Fb#result',
    ],
    [
      '/other/v1/docs?tab=api#heading',
      '/repo',
      '/other/v1/docs?tab=api#heading',
    ],
    [
      '/v1-docs/usage?version=/v1#v2',
      undefined,
      '/v1-docs/usage?version=/v1#v2',
    ],
  ] as const)(
    'removes a prefix from %s with basename %s',
    (url, basename, expected) => {
      expect(removeVersionPrefix(url, basename)).toBe(expected);
    }
  );

  it.each([
    ['/v1', 'v2', undefined, '/v2'],
    ['/v2/', 'v1', '/', '/v1'],
    [
      '/v1/documentation/usage?tab=api#example',
      'v2',
      undefined,
      '/v2/documentation/usage?tab=api#example',
    ],
    [
      '/react-query-builder/v2/unknown/deep?value=a%2Fb#result',
      'v1',
      '/react-query-builder/',
      '/react-query-builder/v1/unknown/deep?value=a%2Fb#result',
    ],
    [
      '/unknown/deep?draft=#result',
      'v2',
      undefined,
      '/v2/unknown/deep?draft=#result',
    ],
    ['/v1/docs#heading', 'v2', undefined, '/v2/docs#heading'],
    ['/v2/docs?version=/v1#v2', 'v2', undefined, '/v2/docs?version=/v1#v2'],
  ] as const)(
    'switches %s to %s with basename %s',
    (url, version, basename, expected) => {
      expect(switchVersionPrefix(url, version, basename)).toBe(expected);
    }
  );

  it.each([
    [undefined, ''],
    ['', ''],
    ['/', ''],
    ['/react-query-builder/', '/react-query-builder'],
    ['organization/repository///', '/organization/repository'],
  ])('normalizes basename %s', (basename, expected) => {
    expect(normalizeBasename(basename)).toBe(expected);
  });
});
