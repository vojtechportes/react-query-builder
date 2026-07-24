import { describe, expect, it } from 'vitest';
import { findV1RouteRecord } from '../app/utils/find-v1-route-record.util';
import { v1SeoConfig } from './constants/v1-seo-config';
import { createV1CanonicalUrl } from './utils/create-v1-canonical-url.util';
import { createV1PageMetadataOptions } from './utils/create-v1-page-metadata-options.util';
import { createV1StructuredData } from './utils/create-v1-structured-data.util';
import { findV1SeoPage } from './utils/find-v1-seo-page.util';

describe('v1 structured data', () => {
  it('creates stable version-prefixed canonicals without double-prefixing', () => {
    expect(createV1CanonicalUrl('/')).toBe(
      'https://vojtechportes.github.io/react-query-builder/v1'
    );
    expect(createV1CanonicalUrl('/api/builder')).toBe(
      'https://vojtechportes.github.io/react-query-builder/v1/api/builder'
    );
    expect(createV1CanonicalUrl('/v1/api/builder')).toBe(
      'https://vojtechportes.github.io/react-query-builder/v1/api/builder'
    );
  });

  it('identifies v1 package content and public breadcrumb URLs', () => {
    const page = findV1SeoPage('/api/builder');
    const route = findV1RouteRecord(page.path);
    const records = createV1StructuredData(
      page.title,
      page.description,
      createV1PageMetadataOptions(page, route)
    );
    const pageRecord = records.find(
      (record) => record['@type'] === 'TechArticle'
    );
    const breadcrumbs = records.find(
      (record) => record['@type'] === 'BreadcrumbList'
    ) as { itemListElement: { item: string }[] } | undefined;

    expect(pageRecord).toMatchObject({
      url: expect.stringContaining('/v1/api/builder'),
      version: v1SeoConfig.packageVersion,
      about: 'React Query Builder v1',
    });
    expect(breadcrumbs?.itemListElement.map(({ item }) => item)).toEqual([
      expect.stringContaining('/v1'),
      expect.stringContaining('/v1/api'),
      expect.stringContaining('/v1/api/builder'),
    ]);
    expect(JSON.stringify(records)).not.toContain('/v2/');
  });

  it('adds FAQ structured data only to v1 pages that own FAQs', () => {
    const recipe = findV1SeoPage('/recipes/server-side-filtering');
    const recipeRecords = createV1StructuredData(
      recipe.title,
      recipe.description,
      createV1PageMetadataOptions(recipe, findV1RouteRecord(recipe.path))
    );
    const home = findV1SeoPage('/');
    const homeRecords = createV1StructuredData(
      home.title,
      home.description,
      createV1PageMetadataOptions(home, findV1RouteRecord(home.path))
    );

    expect(
      recipeRecords.find((record) => record['@type'] === 'FAQPage')
    ).toBeDefined();
    expect(
      homeRecords.find((record) => record['@type'] === 'FAQPage')
    ).toBeUndefined();
  });
});
