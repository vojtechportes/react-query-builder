/* @vitest-environment jsdom */

import * as React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { V1AppRoutes } from '../app/v1-app-routes';

beforeAll(() => {
  window.scrollTo = vi.fn();
});

afterEach(() => {
  cleanup();
});

const renderSearchRoute = (basename: string) => {
  const router = createMemoryRouter([{ path: '*', element: <V1AppRoutes /> }], {
    basename,
    initialEntries: [basename],
  });

  render(<RouterProvider router={router} />);

  return router;
};

describe('v1 search navigation', () => {
  it.each([
    ['/v1', '/v1/api/parse-query'],
    ['/react-query-builder/v1', '/react-query-builder/v1/api/parse-query'],
  ])(
    'navigates inside the v1 basename %s without duplicating its prefix',
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
