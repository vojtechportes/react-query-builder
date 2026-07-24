/* @vitest-environment jsdom */

import * as React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { V2AppRoutes } from '../app/v2-app-routes';

beforeAll(() => {
  window.scrollTo = vi.fn();
});

afterEach(() => {
  cleanup();
});

const renderSearchRoute = (basename: string) => {
  const router = createMemoryRouter([{ path: '*', element: <V2AppRoutes /> }], {
    basename,
    initialEntries: [basename],
  });

  render(<RouterProvider router={router} />);

  return router;
};

describe('v2 search navigation', () => {
  it.each([
    ['/v2', '/v2/api/parse-query'],
    ['/react-query-builder/v2', '/react-query-builder/v2/api/parse-query'],
  ])(
    'navigates inside the v2 basename %s without duplicating its prefix',
    async (basename, expectedPathname) => {
      const router = renderSearchRoute(basename);
      const searchInput = screen.getAllByPlaceholderText(
        'Search docs and pages'
      )[0];

      fireEvent.focus(searchInput);
      fireEvent.change(searchInput, { target: { value: 'parseQuery' } });
      fireEvent.click(
        await screen.findByRole('button', { name: /parseQuery API reference/i })
      );

      expect(router.state.location.pathname).toBe(expectedPathname);
      expect((searchInput as HTMLInputElement).value).toBe('');
    }
  );
});
