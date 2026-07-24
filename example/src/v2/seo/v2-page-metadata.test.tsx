/* @vitest-environment jsdom */

import * as React from 'react';
import { cleanup, render, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { findV2RouteRecord } from '../app/utils/find-v2-route-record.util';
import { useV2PageMetadata } from './hooks/use-v2-page-metadata';
import type { IV2SeoPage } from './types/v2-seo-page';
import { createV2PageMetadataOptions } from './utils/create-v2-page-metadata-options.util';
import { findV2SeoPage } from './utils/find-v2-seo-page.util';

const V2MetadataHarness: React.FC<{ page: IV2SeoPage }> = ({ page }) => {
  useV2PageMetadata(
    page.title,
    page.description,
    createV2PageMetadataOptions(page, findV2RouteRecord(page.path))
  );

  return null;
};

afterEach(() => {
  cleanup();
  document.head.innerHTML = '';
});

describe('v2 page metadata', () => {
  it('updates the head with v2-owned metadata and structured data', async () => {
    const page = findV2SeoPage('/api/builder');

    render(<V2MetadataHarness page={page} />);

    await waitFor(() => {
      expect(document.title).toBe(`${page.title} | React Query Builder`);
    });

    expect(
      document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
        ?.href
    ).toContain('/v2/api/builder');
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
      url: expect.stringContaining('/v2/api/builder'),
      version: '1.33.1',
    });
  });

  it('updates existing head elements instead of duplicating them', async () => {
    const { rerender } = render(
      <V2MetadataHarness page={findV2SeoPage('/')} />
    );

    rerender(
      <V2MetadataHarness page={findV2SeoPage('/documentation/usage')} />
    );

    await waitFor(() => {
      expect(
        document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
          ?.href
      ).toContain('/v2/documentation/usage');
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
