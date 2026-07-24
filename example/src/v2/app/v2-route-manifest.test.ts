import { describe, expect, it } from 'vitest';
import { v2TopNavigation } from '../navigation/constants/v2-top-navigation';
import { v2ApiSidebar } from '../navigation/constants/v2-api-sidebar';
import { v2DocumentationSidebar } from '../navigation/constants/v2-documentation-sidebar';
import { v2RecipesSidebar } from '../navigation/constants/v2-recipes-sidebar';
import { apiPages } from '../pages/api-page/constants/api-pages';
import { documentationPages } from '../pages/documentation-page/constants/documentation-pages';
import { recipes } from '../pages/recipes-page/pages/recipes-content';
import { v2FallbackRoute } from './constants/v2-fallback-route';
import { v2LegacyRouteRedirects } from './constants/v2-legacy-route-redirects';
import { v2RouteManifest } from './constants/v2-route-manifest';
import { createV2PublicPath } from './utils/create-v2-public-path.util';
import { findV2RouteRecord } from './utils/find-v2-route-record.util';
import { getV2RouterBasename } from './utils/get-v2-router-basename.util';

const v2SourcePaths = new Set(
  Object.keys(
    import.meta.glob([
      '/src/v2/pages/home-page/home-page.tsx',
      '/src/v2/pages/demo-page/demo-page.tsx',
      '/src/v2/pages/api-page/components/*-api-content.tsx',
      '/src/v2/pages/documentation-page/pages/*/*.tsx',
      '/src/v2/pages/recipes-page/pages/*.recipe.ts',
      '/src/v2/pages/recipes-page/recipes-page.tsx',
    ])
  ).map((path) => `example${path}`)
);
const expectedCanonicalPaths = [
  '/',
  ...documentationPages.map((page) => page.path),
  ...apiPages.map((page) => page.path),
  '/demo',
  '/recipes',
  ...recipes.map((page) => page.path),
];

const getSidebarPaths = (sidebar: {
  overviewPage: { path: string };
  groups: { pages: { path: string }[] }[];
}) => [
  sidebar.overviewPage.path,
  ...sidebar.groups.flatMap((group) => group.pages.map((page) => page.path)),
];

describe('v2 route manifest', () => {
  it('owns the complete canonical v2 route set exactly once', () => {
    const manifestPaths = v2RouteManifest.map((route) => route.path);

    expect(manifestPaths).toHaveLength(55);
    expect(new Set(manifestPaths).size).toBe(manifestPaths.length);
    expect(new Set(manifestPaths)).toEqual(new Set(expectedCanonicalPaths));
  });

  it('provides v2 public paths, breadcrumbs, related links, and source links', () => {
    const manifestPaths = new Set(v2RouteManifest.map((route) => route.path));

    for (const route of v2RouteManifest) {
      expect(route.publicPath).toBe(createV2PublicPath(route.path));
      expect(route.breadcrumbs[0]).toEqual({
        label: 'Home',
        path: '/',
        publicPath: '/v2',
      });
      expect(route.breadcrumbs.at(-1)?.path).toBe(route.path);
      expect(route.sourceLink.path).toMatch(/^example\/src\/v2\//);
      expect(route.sourceLink.href).toBe(
        `https://github.com/vojtechportes/react-query-builder/blob/master/${route.sourceLink.path}`
      );
      expect(v2SourcePaths.has(route.sourceLink.path)).toBe(true);

      for (const relatedLink of route.relatedLinks) {
        if (relatedLink.external) {
          expect(relatedLink.path).toMatch(/^https?:\/\//);
          expect(relatedLink.publicPath).toBeUndefined();
        } else {
          expect(manifestPaths.has(relatedLink.path)).toBe(true);
          expect(relatedLink.publicPath).toBe(
            createV2PublicPath(relatedLink.path)
          );
        }
      }
    }
  });

  it('creates the expected top navigation and complete section sidebars', () => {
    expect(v2TopNavigation).toEqual([
      { label: 'Home', path: '/', publicPath: '/v2' },
      {
        label: 'Documentation',
        path: '/documentation',
        publicPath: '/v2/documentation',
      },
      { label: 'API', path: '/api', publicPath: '/v2/api' },
      { label: 'Demo', path: '/demo', publicPath: '/v2/demo' },
      { label: 'Recipes', path: '/recipes', publicPath: '/v2/recipes' },
    ]);
    expect(getSidebarPaths(v2DocumentationSidebar)).toEqual(
      documentationPages.map((page) => page.path)
    );
    expect(getSidebarPaths(v2ApiSidebar)).toEqual(
      apiPages.map((page) => page.path)
    );
    expect(getSidebarPaths(v2RecipesSidebar)).toEqual([
      '/recipes',
      ...recipes.map((page) => page.path),
    ]);
  });

  it('defines all legacy destinations and the unknown-route fallback within v2', () => {
    const canonicalPaths = new Set(v2RouteManifest.map((route) => route.path));

    expect(v2LegacyRouteRedirects).toHaveLength(8);
    expect(
      new Set(v2LegacyRouteRedirects.map((route) => route.from)).size
    ).toBe(8);

    for (const redirect of v2LegacyRouteRedirects) {
      expect(canonicalPaths.has(redirect.to)).toBe(true);
      expect(redirect.publicFrom).toBe(createV2PublicPath(redirect.from));
      expect(redirect.publicTo).toBe(createV2PublicPath(redirect.to));
    }

    expect(v2FallbackRoute).toEqual({
      path: '*',
      to: '/',
      publicTo: '/v2',
    });
    expect(findV2RouteRecord('/not-owned-by-v2')).toBe(v2RouteManifest[0]);
    expect(findV2RouteRecord('/api/builder/').path).toBe('/api/builder');
  });

  it.each([
    ['/', undefined, '/v2'],
    ['/documentation/usage', undefined, '/v2/documentation/usage'],
    [
      '/documentation/usage?tab=api#example',
      undefined,
      '/v2/documentation/usage?tab=api#example',
    ],
    ['/', '/react-query-builder/', '/react-query-builder/v2'],
    [
      '/api/adapters/mui?tab=props#theme',
      '/react-query-builder/',
      '/react-query-builder/v2/api/adapters/mui?tab=props#theme',
    ],
  ] as const)(
    'prefixes %s with deployment basename %s',
    (path, base, expected) => {
      expect(createV2PublicPath(path, base)).toBe(expected);
    }
  );

  it('creates root and repository deployment router basenames', () => {
    expect(getV2RouterBasename()).toBe('/v2');
    expect(getV2RouterBasename('/react-query-builder/')).toBe(
      '/react-query-builder/v2'
    );
  });
});
