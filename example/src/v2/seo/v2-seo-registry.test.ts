import { describe, expect, it } from 'vitest';
import { v2RouteManifest } from '../app/constants/v2-route-manifest';
import { v2SeoConfig } from './constants/v2-seo-config';
import { v2SeoPages } from './constants/v2-seo-pages';

const routePaths = v2RouteManifest.map(({ path }) => path).sort();
const seoPaths = v2SeoPages.map(({ path }) => path).sort();

describe('v2 SEO registry', () => {
  it('owns exactly the canonical v2 route set', () => {
    expect(v2SeoPages).toHaveLength(55);
    expect(new Set(seoPaths).size).toBe(v2SeoPages.length);
    expect(seoPaths).toEqual(routePaths);
  });

  it('maps every internal route to one v2 public canonical path', () => {
    expect(
      v2RouteManifest.map(({ path, publicPath }) => ({ path, publicPath }))
    ).toEqual(
      expect.arrayContaining(
        v2SeoPages.map(({ path }) => ({
          path,
          publicPath: `${v2SeoConfig.versionPath}${path === '/' ? '' : path}`,
        }))
      )
    );
  });

  it('contains unique complete metadata without claiming v1', () => {
    expect(new Set(v2SeoPages.map(({ title }) => title)).size).toBe(
      v2SeoPages.length
    );
    expect(new Set(v2SeoPages.map(({ description }) => description)).size).toBe(
      v2SeoPages.length
    );

    for (const page of v2SeoPages) {
      expect(page.title.length).toBeGreaterThanOrEqual(18);
      expect(page.title.length).toBeLessThanOrEqual(70);
      expect(page.description.length).toBeGreaterThanOrEqual(70);
      expect(page.description.length).toBeLessThanOrEqual(180);
      expect(page.keywords.toLowerCase()).toContain('react query builder');
      expect(page.keywords.toLowerCase()).toContain('typescript query builder');
    }

    expect(JSON.stringify(v2SeoConfig)).not.toContain('/v1/');
    expect(v2SeoConfig).toMatchObject({
      siteVersion: 'v2',
      packageVersion: '1.33.1',
      versionPath: '/v2',
    });
  });
});
