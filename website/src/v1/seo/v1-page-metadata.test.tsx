/* @vitest-environment jsdom */

import * as React from 'react';
import { cleanup, render, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { findV1RouteRecord } from '../app/utils/find-v1-route-record.util';
import { useV1PageMetadata } from './hooks/use-v1-page-metadata';
import type { IV1SeoPage } from './types/v1-seo-page';
import { createV1PageMetadataOptions } from './utils/create-v1-page-metadata-options.util';
import { findV1SeoPage } from './utils/find-v1-seo-page.util';

const V1MetadataHarness: React.FC<{ page: IV1SeoPage }> = ({ page }) => {
  useV1PageMetadata(
    page.title,
    page.description,
    createV1PageMetadataOptions(page, findV1RouteRecord(page.path))
  );

  return null;
};

afterEach(() => {
  cleanup();
  document.head.innerHTML = '';
});

describe('v1 page metadata', () => {
  it('updates the head with v1-owned metadata and structured data', async () => {
    const page = findV1SeoPage('/api/builder');

    render(<V1MetadataHarness page={page} />);

    await waitFor(() => {
      expect(document.title).toBe(`${page.title} | React Query Builder`);
    });

    expect(
      document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
        ?.href
    ).toContain('/v1/api/builder');
    expect(
      document.head.querySelector<HTMLMetaElement>('meta[name="robots"]')
        ?.content
    ).toContain('index,follow');

    const structuredData = JSON.parse(
      document.head.querySelector<HTMLScriptElement>(
        'script#structured-data-page'
      )?.textContent ?? '[]'
    ) as Record<string, unknown>[];

    expect(
      structuredData.find((record) => record['@type'] === 'TechArticle')
    ).toMatchObject({
      url: expect.stringContaining('/v1/api/builder'),
      version: '1.33.1',
    });
  });

  it('updates existing head elements instead of duplicating them', async () => {
    const { rerender } = render(
      <V1MetadataHarness page={findV1SeoPage('/')} />
    );

    rerender(
      <V1MetadataHarness page={findV1SeoPage('/documentation/usage')} />
    );

    await waitFor(() => {
      expect(
        document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
          ?.href
      ).toContain('/v1/documentation/usage');
    });

    expect(
      document.head.querySelectorAll('link[rel="canonical"]')
    ).toHaveLength(1);
    expect(
      document.head.querySelectorAll('script#structured-data-page')
    ).toHaveLength(1);
    expect(
      document.head.querySelectorAll('meta[name="description"]')
    ).toHaveLength(1);
  });
});
