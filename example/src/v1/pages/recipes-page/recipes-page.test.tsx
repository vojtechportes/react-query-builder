/* @vitest-environment jsdom */

import * as React from 'react';
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { RecipesPage } from './recipes-page';

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

vi.mock('./components/recipe-live-demo', async () => {
  const ReactModule = await import('react');
  const PendingDemo = ReactModule.lazy(
    () => new Promise<{ default: React.ComponentType }>(() => undefined)
  );
  const ResolvedDemo = () =>
    ReactModule.createElement('p', null, 'Loaded Prisma demo');
  let initialLoader: unknown;

  return {
    RecipeLiveDemo: ({ loader }: { loader: unknown }) => {
      initialLoader ??= loader;
      const Demo = loader === initialLoader ? ResolvedDemo : PendingDemo;

      return ReactModule.createElement(
        ReactModule.Suspense,
        {
          fallback: ReactModule.createElement(
            'p',
            { role: 'status' },
            'Loading interactive demo...'
          ),
        },
        ReactModule.createElement(Demo)
      );
    },
  };
});

describe('RecipesPage navigation', () => {
  it('replaces recipe content while the next lazy demo is pending', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);

    try {
      await act(async () => {
        root.render(
          <MemoryRouter initialEntries={['/recipes/prisma-filter-ui']}>
            <Routes>
              <Route path="/recipes/*" element={<RecipesPage />} />
            </Routes>
          </MemoryRouter>
        );
      });

      expect(container.querySelector('h1')?.textContent).toBe(
        'Build a Prisma Filter UI with React Query Builder'
      );
      expect(container.textContent).toContain('Loaded Prisma demo');
      expect(container.querySelector('[role="status"]')).toBeNull();

      const tanstackLink = Array.from(container.querySelectorAll('a')).find(
        (link) =>
          link.textContent ===
          'TanStack Table Filtering with React Query Builder'
      );

      expect(tanstackLink).toBeTruthy();

      await act(async () => {
        tanstackLink?.dispatchEvent(
          new MouseEvent('click', {
            bubbles: true,
            button: 0,
            cancelable: true,
          })
        );
      });

      expect(container.querySelector('h1')?.textContent).toBe(
        'TanStack Table Filtering with React Query Builder'
      );
      expect(tanstackLink?.className).toContain('active');
      expect(
        Array.from(container.querySelectorAll('h1')).some(
          (heading) =>
            heading.textContent ===
            'Build a Prisma Filter UI with React Query Builder'
        )
      ).toBe(false);
      expect(container.querySelector('[role="status"]')?.textContent).toBe(
        'Loading interactive demo...'
      );
    } finally {
      await act(async () => {
        root.unmount();
      });
      container.remove();
    }
  });
});
