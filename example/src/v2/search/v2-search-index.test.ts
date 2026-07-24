import { describe, expect, it } from 'vitest';
import { v2RouteManifest } from '../app/constants/v2-route-manifest';
import { v2SearchDocuments } from './constants/v2-search-documents';
import { createV2SearchDocuments } from './utils/create-v2-search-documents.util';
import { createV2SearchIndex } from './utils/create-v2-search-index.util';
import { searchV2Index } from './utils/search-v2-index.util';

const searchIndex = createV2SearchIndex(v2SearchDocuments);

describe('v2 search index', () => {
  it('indexes every canonical v2 route exactly once', () => {
    const documentPaths = v2SearchDocuments.map((document) => document.path);
    const manifestPaths = v2RouteManifest.map((route) => route.path);

    expect(documentPaths).toHaveLength(55);
    expect(new Set(documentPaths).size).toBe(documentPaths.length);
    expect(new Set(documentPaths)).toEqual(new Set(manifestPaths));
  });

  it('uses v2 manifest paths for every result URL', () => {
    const routesByPath = new Map(
      v2RouteManifest.map((route) => [route.path, route])
    );

    for (const document of v2SearchDocuments) {
      const route = routesByPath.get(document.path);

      expect(route).toBeDefined();
      expect(document.publicPath).toBe(route?.publicPath);
      expect(document.publicPath).toMatch(/^\/v2(?:\/|$)/);
      expect(document.publicPath).not.toContain('/v1');
    }
  });

  it.each([
    ['interactive playground localization', '/demo'],
    ['dynamic field options', '/documentation/dynamic-field-options'],
    ['createMuiComponents API', '/api/adapters/mui'],
    ['AG Grid filter panel', '/recipes/ag-grid-query-builder'],
  ])('returns the relevant v2 result for %s', (query, expectedPath) => {
    expect(searchV2Index(searchIndex, query)[0]?.path).toBe(expectedPath);
  });

  it('supports prefix and fuzzy matching while requiring every term', () => {
    expect(searchV2Index(searchIndex, 'localiz')[0]?.path).toBe(
      '/documentation/localization'
    );
    expect(searchV2Index(searchIndex, 'instalation')[0]?.path).toBe(
      '/documentation/installation'
    );
    expect(searchV2Index(searchIndex, 'parseQuery missing-term')).toEqual([]);
    expect(searchV2Index(searchIndex, '   ')).toEqual([]);
  });

  it('rejects an indexable page that has no v2 route', () => {
    expect(() =>
      createV2SearchDocuments(
        [
          {
            path: '/missing',
            title: 'Missing',
            summary: 'This page has no v2 route.',
            searchText: 'missing-v2-route-sentinel',
          },
        ],
        v2RouteManifest
      )
    ).toThrow('Cannot index v2 search page without a v2 route: /missing');
  });

  it('indexes a v2-only page without a v1 equivalent', () => {
    const v2OnlyRoute = {
      ...v2RouteManifest[0],
      path: '/v2-only',
      publicPath: '/v2/v2-only',
    };
    const documents = createV2SearchDocuments(
      [
        {
          path: '/v2-only',
          title: 'V2 only',
          summary: 'Available only in the v2 route manifest.',
          searchText: 'v2-only-search-sentinel',
        },
      ],
      [v2OnlyRoute]
    );
    const v2OnlyIndex = createV2SearchIndex(documents);

    expect(searchV2Index(v2OnlyIndex, 'v2-only-search-sentinel')).toMatchObject(
      [
        {
          path: '/v2-only',
          publicPath: '/v2/v2-only',
        },
      ]
    );
  });

  it('does not include v1-only static page copy', () => {
    expect(searchV2Index(searchIndex, 'nested filter editors')).toEqual([]);
  });
});
