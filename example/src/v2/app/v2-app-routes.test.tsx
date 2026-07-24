/* @vitest-environment jsdom */

import * as React from 'react';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { renderApp } from '../../shared/ssr/render-app.util';
import { V2AppRoutes } from './v2-app-routes';
import { getV2RouterBasename } from './utils/get-v2-router-basename.util';

beforeAll(() => {
  window.scrollTo = vi.fn();
});

afterEach(() => {
  cleanup();
});

const renderClientRoute = (path: string) =>
  render(
    <MemoryRouter basename="/v2" initialEntries={[`/v2${path}`]}>
      <V2AppRoutes />
    </MemoryRouter>
  );

describe('v2 app routes', () => {
  it('renders v2-prefixed top navigation and nested sidebar links', () => {
    const page = renderApp(
      '/documentation/adapters/mui',
      getV2RouterBasename(),
      <V2AppRoutes />
    );

    expect(page.html).toContain('href="/v2"');
    expect(page.html).toContain('href="/v2/documentation"');
    expect(page.html).toContain('href="/v2/api"');
    expect(page.html).toContain('href="/v2/demo"');
    expect(page.html).toContain('href="/v2/recipes"');
    expect(page.html).toContain('href="/v2/documentation/adapters/mui"');
  });

  it('renders links under a repository deployment basename', () => {
    const page = renderApp(
      '/api/adapters/mui',
      getV2RouterBasename('/react-query-builder/'),
      <V2AppRoutes />
    );

    expect(page.html).toContain('href="/react-query-builder/v2"');
    expect(page.html).toContain('href="/react-query-builder/v2/documentation"');
    expect(page.html).toContain(
      'href="/react-query-builder/v2/api/adapters/mui"'
    );
    expect(page.html).not.toContain('/v2/v2');
  });

  it('renders v2-prefixed related links', () => {
    const page = renderApp(
      '/documentation/dynamic-field-options',
      getV2RouterBasename(),
      <V2AppRoutes />
    );

    expect(page.html).toContain(
      'href="/v2/recipes/dynamic-operators-by-field-type"'
    );
  });

  it('uses public v2 paths in client metadata and breadcrumbs', async () => {
    renderClientRoute('/api/builder');

    await waitFor(() => {
      expect(
        document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
          ?.href
      ).toContain('/v2/api/builder');
    });

    const structuredData = JSON.parse(
      document.head.querySelector<HTMLScriptElement>(
        'script#structured-data-page'
      )?.textContent ?? '[]'
    ) as {
      '@type': string;
      itemListElement?: { item: string }[];
    }[];
    const breadcrumbs = structuredData.find(
      (record) => record['@type'] === 'BreadcrumbList'
    );

    expect(breadcrumbs?.itemListElement?.map((item) => item.item)).toEqual([
      expect.stringContaining('/v2'),
      expect.stringContaining('/v2/api'),
      expect.stringContaining('/v2/api/builder'),
    ]);
  });

  it('redirects a legacy v2 route to its owned canonical destination', async () => {
    renderClientRoute('/api/builder-props');

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Builder' })
    ).toBeDefined();
  });

  it('handles an unknown v2 route by returning to the v2 Home page', async () => {
    renderClientRoute('/route-not-owned-by-v2');

    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: 'React Query Builder',
      })
    ).toBeDefined();
  });
});
