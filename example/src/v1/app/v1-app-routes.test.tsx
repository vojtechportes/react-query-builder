/* @vitest-environment jsdom */

import * as React from 'react';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { renderApp } from '../../shared/ssr/render-app.util';
import { V1AppRoutes } from './v1-app-routes';
import { getV1RouterBasename } from './utils/get-v1-router-basename.util';

beforeAll(() => {
  window.scrollTo = vi.fn();
});

afterEach(() => {
  cleanup();
});

const renderClientRoute = (path: string) => {
  const router = createMemoryRouter([{ path: '*', element: <V1AppRoutes /> }], {
    basename: '/v1',
    initialEntries: [`/v1${path}`],
  });

  render(<RouterProvider router={router} />);

  return router;
};

describe('v1 app routes', () => {
  it('renders the version switcher outside the Brand link on all layouts', () => {
    renderClientRoute('/');

    const brand = screen.getByRole('link', { name: /React Query Builder/i });
    const trigger = screen.getByRole('button', {
      name: 'Documentation version. Current version: v1',
    });

    expect(brand.contains(trigger)).toBe(false);
    expect(trigger.closest('#mobile-site-panel')).toBeNull();
  });
  it('renders v1-prefixed top navigation and nested sidebar links', () => {
    const page = renderApp(
      '/documentation/adapters/mui',
      getV1RouterBasename(),
      <V1AppRoutes />
    );

    expect(page.html).toContain('href="/v1"');
    expect(page.html).toContain('href="/v1/documentation"');
    expect(page.html).toContain('href="/v1/api"');
    expect(page.html).toContain('href="/v1/demo"');
    expect(page.html).toContain('href="/v1/recipes"');
    expect(page.html).toContain('href="/v1/documentation/adapters/mui"');
  });

  it('renders links under a repository deployment basename', () => {
    const page = renderApp(
      '/api/adapters/mui',
      getV1RouterBasename('/react-query-builder/'),
      <V1AppRoutes />
    );

    expect(page.html).toContain('href="/react-query-builder/v1"');
    expect(page.html).toContain('href="/react-query-builder/v1/documentation"');
    expect(page.html).toContain(
      'href="/react-query-builder/v1/api/adapters/mui"'
    );
    expect(page.html).not.toContain('/v1/v1');
  });

  it('renders v1-prefixed related links', () => {
    const page = renderApp(
      '/documentation/dynamic-field-options',
      getV1RouterBasename(),
      <V1AppRoutes />
    );

    expect(page.html).toContain(
      'href="/v1/recipes/dynamic-operators-by-field-type"'
    );
  });

  it('uses public v1 paths in client metadata and breadcrumbs', async () => {
    renderClientRoute('/api/builder');

    await waitFor(() => {
      expect(
        document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
          ?.href
      ).toContain('/v1/api/builder');
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
      expect.stringContaining('/v1'),
      expect.stringContaining('/v1/api'),
      expect.stringContaining('/v1/api/builder'),
    ]);
  });

  it('redirects a legacy v1 route to its owned canonical destination', async () => {
    const router = renderClientRoute(
      '/api/builder-props?q=a%2Fb&q=c&empty=#ref%201'
    );

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Builder' })
    ).toBeDefined();
    expect(router.state.location).toMatchObject({
      pathname: '/v1/api/builder',
      search: '?q=a%2Fb&q=c&empty=',
      hash: '#ref%201',
    });
  });
  it('handles an unknown v1 route by returning to the v1 Home page', async () => {
    const router = renderClientRoute('/route-not-owned-by-v1?draft=#fallback');

    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: 'React Query Builder',
      })
    ).toBeDefined();
    expect(router.state.location).toMatchObject({
      pathname: '/v1',
      search: '?draft=',
      hash: '#fallback',
    });
  });
});
