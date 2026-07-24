import { describe, expect, it } from 'vitest';
import { v1TopNavigation } from '../navigation/constants/v1-top-navigation';
import { v1ApiSidebar } from '../navigation/constants/v1-api-sidebar';
import { v1DocumentationSidebar } from '../navigation/constants/v1-documentation-sidebar';
import { v1RecipesSidebar } from '../navigation/constants/v1-recipes-sidebar';
import { apiPages } from '../pages/api-page/constants/api-pages';
import { documentationPages } from '../pages/documentation-page/constants/documentation-pages';
import { recipes } from '../pages/recipes-page/pages/recipes-content';
import { v1FallbackRoute } from './constants/v1-fallback-route';
import { v1LegacyRouteRedirects } from './constants/v1-legacy-route-redirects';
import { v1RouteManifest } from './constants/v1-route-manifest';
import { createV1PublicPath } from './utils/create-v1-public-path.util';
import { findV1RouteRecord } from './utils/find-v1-route-record.util';
import { getV1RouterBasename } from './utils/get-v1-router-basename.util';

const v1SourcePaths = new Set(
  Object.keys(
    import.meta.glob([
      '/src/v1/pages/home-page/home-page.tsx',
      '/src/v1/pages/demo-page/demo-page.tsx',
      '/src/v1/pages/api-page/components/*-api-content.tsx',
      '/src/v1/pages/documentation-page/pages/*/*.tsx',
      '/src/v1/pages/recipes-page/pages/*.recipe.ts',
      '/src/v1/pages/recipes-page/recipes-page.tsx',
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

describe('v1 route manifest', () => {
  it('owns the complete canonical v1 route set exactly once', () => {
    const manifestPaths = v1RouteManifest.map((route) => route.path);

    expect(manifestPaths).toHaveLength(55);
    expect(new Set(manifestPaths).size).toBe(manifestPaths.length);
    expect(new Set(manifestPaths)).toEqual(new Set(expectedCanonicalPaths));
  });

  it('provides v1 public paths, breadcrumbs, related links, and source links', () => {
    const manifestPaths = new Set(v1RouteManifest.map((route) => route.path));

    for (const route of v1RouteManifest) {
      expect(route.publicPath).toBe(createV1PublicPath(route.path));
      expect(route.breadcrumbs[0]).toEqual({
        label: 'Home',
        path: '/',
        publicPath: '/v1',
      });
      expect(route.breadcrumbs.at(-1)?.path).toBe(route.path);
      expect(route.sourceLink.path).toMatch(/^example\/src\/v1\//);
      expect(route.sourceLink.href).toBe(
        `https://github.com/vojtechportes/react-query-builder/blob/master/${route.sourceLink.path}`
      );
      expect(v1SourcePaths.has(route.sourceLink.path)).toBe(true);

      for (const relatedLink of route.relatedLinks) {
        if (relatedLink.external) {
          expect(relatedLink.path).toMatch(/^https?:\/\//);
          expect(relatedLink.publicPath).toBeUndefined();
        } else {
          expect(manifestPaths.has(relatedLink.path)).toBe(true);
          expect(relatedLink.publicPath).toBe(
            createV1PublicPath(relatedLink.path)
          );
        }
      }
    }
  });

  it('creates the expected top navigation and complete section sidebars', () => {
    expect(v1TopNavigation).toEqual([
      { label: 'Home', path: '/', publicPath: '/v1' },
      {
        label: 'Documentation',
        path: '/documentation',
        publicPath: '/v1/documentation',
      },
      { label: 'API', path: '/api', publicPath: '/v1/api' },
      { label: 'Demo', path: '/demo', publicPath: '/v1/demo' },
      { label: 'Recipes', path: '/recipes', publicPath: '/v1/recipes' },
    ]);
    expect(getSidebarPaths(v1DocumentationSidebar)).toEqual(
      documentationPages.map((page) => page.path)
    );
    expect(getSidebarPaths(v1ApiSidebar)).toEqual(
      apiPages.map((page) => page.path)
    );
    expect(getSidebarPaths(v1RecipesSidebar)).toEqual([
      '/recipes',
      ...recipes.map((page) => page.path),
    ]);
  });

  it('defines all legacy destinations and the unknown-route fallback within v1', () => {
    const canonicalPaths = new Set(v1RouteManifest.map((route) => route.path));

    expect(v1LegacyRouteRedirects).toHaveLength(8);
    expect(
      new Set(v1LegacyRouteRedirects.map((route) => route.from)).size
    ).toBe(8);

    for (const redirect of v1LegacyRouteRedirects) {
      expect(canonicalPaths.has(redirect.to)).toBe(true);
      expect(redirect.publicFrom).toBe(createV1PublicPath(redirect.from));
      expect(redirect.publicTo).toBe(createV1PublicPath(redirect.to));
    }

    expect(v1FallbackRoute).toEqual({
      path: '*',
      to: '/',
      publicTo: '/v1',
    });
    expect(findV1RouteRecord('/not-owned-by-v1')).toBe(v1RouteManifest[0]);
    expect(findV1RouteRecord('/api/builder/').path).toBe('/api/builder');
  });

  it.each([
    ['/', undefined, '/v1'],
    ['/documentation/usage', undefined, '/v1/documentation/usage'],
    [
      '/documentation/usage?tab=api#example',
      undefined,
      '/v1/documentation/usage?tab=api#example',
    ],
    ['/', '/react-query-builder/', '/react-query-builder/v1'],
    [
      '/api/adapters/mui?tab=props#theme',
      '/react-query-builder/',
      '/react-query-builder/v1/api/adapters/mui?tab=props#theme',
    ],
  ] as const)(
    'prefixes %s with deployment basename %s',
    (path, base, expected) => {
      expect(createV1PublicPath(path, base)).toBe(expected);
    }
  );

  it('creates root and repository deployment router basenames', () => {
    expect(getV1RouterBasename()).toBe('/v1');
    expect(getV1RouterBasename('/react-query-builder/')).toBe(
      '/react-query-builder/v1'
    );
  });
});
