import { describe, expect, it } from 'vitest';
import { findV2RouteRecord } from '../app/utils/find-v2-route-record.util';
import { v2SeoConfig } from './constants/v2-seo-config';
import { createV2CanonicalUrl } from './utils/create-v2-canonical-url.util';
import { createV2PageMetadataOptions } from './utils/create-v2-page-metadata-options.util';
import { createV2StructuredData } from './utils/create-v2-structured-data.util';
import { findV2SeoPage } from './utils/find-v2-seo-page.util';

describe('v2 structured data', () => {
  it('creates stable version-prefixed canonicals without double-prefixing', () => {
    expect(createV2CanonicalUrl('/')).toBe(
      'https://vojtechportes.github.io/react-query-builder/v2'
    );
    expect(createV2CanonicalUrl('/api/builder')).toBe(
      'https://vojtechportes.github.io/react-query-builder/v2/api/builder'
    );
    expect(createV2CanonicalUrl('/v2/api/builder')).toBe(
      'https://vojtechportes.github.io/react-query-builder/v2/api/builder'
    );
  });

  it('identifies v2 package content and public breadcrumb URLs', () => {
    const page = findV2SeoPage('/api/builder');
    const route = findV2RouteRecord(page.path);
    const records = createV2StructuredData(
      page.title,
      page.description,
      createV2PageMetadataOptions(page, route)
    );
    const pageRecord = records.find(
      (record) => record['@type'] === 'TechArticle'
    );
    const breadcrumbs = records.find(
      (record) => record['@type'] === 'BreadcrumbList'
    ) as { itemListElement: { item: string }[] } | undefined;

    expect(pageRecord).toMatchObject({
      url: expect.stringContaining('/v2/api/builder'),
      version: v2SeoConfig.packageVersion,
      about: 'React Query Builder v2',
    });
    expect(breadcrumbs?.itemListElement.map(({ item }) => item)).toEqual([
      expect.stringContaining('/v2'),
      expect.stringContaining('/v2/api'),
      expect.stringContaining('/v2/api/builder'),
    ]);
    expect(JSON.stringify(records)).not.toContain('/v1/');
  });

  it('adds FAQ structured data only to v2 pages that own FAQs', () => {
    const recipe = findV2SeoPage('/recipes/server-side-filtering');
    const recipeRecords = createV2StructuredData(
      recipe.title,
      recipe.description,
      createV2PageMetadataOptions(recipe, findV2RouteRecord(recipe.path))
    );
    const home = findV2SeoPage('/');
    const homeRecords = createV2StructuredData(
      home.title,
      home.description,
      createV2PageMetadataOptions(home, findV2RouteRecord(home.path))
    );

    expect(
      recipeRecords.find((record) => record['@type'] === 'FAQPage')
    ).toBeDefined();
    expect(
      homeRecords.find((record) => record['@type'] === 'FAQPage')
    ).toBeUndefined();
  });
});
