import { describe, expect, it } from 'vitest';
import { v1RouteManifest } from '../app/constants/v1-route-manifest';
import { v1SearchDocuments } from './constants/v1-search-documents';
import { createV1SearchDocuments } from './utils/create-v1-search-documents.util';
import { createV1SearchIndex } from './utils/create-v1-search-index.util';
import { searchV1Index } from './utils/search-v1-index.util';

const searchIndex = createV1SearchIndex(v1SearchDocuments);

describe('v1 search index', () => {
  it('indexes every canonical v1 route exactly once', () => {
    const documentPaths = v1SearchDocuments.map((document) => document.path);
    const manifestPaths = v1RouteManifest.map((route) => route.path);

    expect(documentPaths).toHaveLength(55);
    expect(new Set(documentPaths).size).toBe(documentPaths.length);
    expect(new Set(documentPaths)).toEqual(new Set(manifestPaths));
  });

  it('uses v1 manifest paths for every result URL', () => {
    const routesByPath = new Map(
      v1RouteManifest.map((route) => [route.path, route])
    );

    for (const document of v1SearchDocuments) {
      const route = routesByPath.get(document.path);

      expect(route).toBeDefined();
      expect(document.publicPath).toBe(route?.publicPath);
      expect(document.publicPath).toMatch(/^\/v1(?:\/|$)/);
      expect(document.publicPath).not.toContain('/v2');
    }
  });

  it.each([
    ['interactive theme editor', '/demo'],
    ['dynamic field options', '/documentation/dynamic-field-options'],
    ['parseQuery parameters', '/api/parse-query'],
    ['AG Grid filter panel', '/recipes/ag-grid-query-builder'],
  ])('returns the relevant v1 result for %s', (query, expectedPath) => {
    expect(searchV1Index(searchIndex, query)[0]?.path).toBe(expectedPath);
  });

  it('supports prefix and fuzzy matching while requiring every term', () => {
    expect(searchV1Index(searchIndex, 'localiz')[0]?.path).toBe(
      '/documentation/localization'
    );
    expect(searchV1Index(searchIndex, 'instalation')[0]?.path).toBe(
      '/documentation/installation'
    );
    expect(searchV1Index(searchIndex, 'parseQuery missing-term')).toEqual([]);
    expect(searchV1Index(searchIndex, '   ')).toEqual([]);
  });

  it('rejects an indexable page that has no v1 route', () => {
    expect(() =>
      createV1SearchDocuments(
        [
          {
            path: '/v2-only',
            title: 'V2 only',
            summary: 'Must not enter v1 search.',
            searchText: 'v2-only-search-sentinel',
          },
        ],
        v1RouteManifest
      )
    ).toThrow('Cannot index v1 search page without a v1 route: /v2-only');

    expect(searchV1Index(searchIndex, 'v2-only-search-sentinel')).toEqual([]);
  });
});
