import { describe, expect, it } from 'vitest';
import { v1RouteManifest } from '../app/constants/v1-route-manifest';
import { v1SeoConfig } from './constants/v1-seo-config';
import { v1SeoPages } from './constants/v1-seo-pages';

const routePaths = v1RouteManifest.map(({ path }) => path).sort();
const seoPaths = v1SeoPages.map(({ path }) => path).sort();

describe('v1 SEO registry', () => {
  it('owns exactly the canonical v1 route set', () => {
    expect(v1SeoPages).toHaveLength(55);
    expect(new Set(seoPaths).size).toBe(v1SeoPages.length);
    expect(seoPaths).toEqual(routePaths);
  });

  it('maps every internal route to one v1 public canonical path', () => {
    expect(
      v1RouteManifest.map(({ path, publicPath }) => ({ path, publicPath }))
    ).toEqual(
      expect.arrayContaining(
        v1SeoPages.map(({ path }) => ({
          path,
          publicPath: `${v1SeoConfig.versionPath}${path === '/' ? '' : path}`,
        }))
      )
    );
  });

  it('contains unique complete metadata without claiming v2', () => {
    expect(new Set(v1SeoPages.map(({ title }) => title)).size).toBe(
      v1SeoPages.length
    );
    expect(new Set(v1SeoPages.map(({ description }) => description)).size).toBe(
      v1SeoPages.length
    );

    for (const page of v1SeoPages) {
      expect(page.title.length).toBeGreaterThanOrEqual(18);
      expect(page.title.length).toBeLessThanOrEqual(70);
      expect(page.description.length).toBeGreaterThanOrEqual(70);
      expect(page.description.length).toBeLessThanOrEqual(180);
      expect(page.keywords.toLowerCase()).toContain('react query builder');
      expect(page.keywords.toLowerCase()).toContain('typescript query builder');
    }

    expect(JSON.stringify(v1SeoConfig)).not.toContain('/v2/');
    expect(v1SeoConfig).toMatchObject({
      siteVersion: 'v1',
      packageVersion: '1.33.1',
      versionPath: '/v1',
    });
  });
});
