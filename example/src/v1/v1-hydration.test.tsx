/* @vitest-environment jsdom */

import * as React from 'react';
import { act } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { V1App } from './app/v1-app';
import { renderPage } from './entry-server';

vi.mock('../components/load-cookie-consent-banner', () => ({
  loadCookieConsentBanner: async () => ({ default: () => null }),
}));

beforeAll(() => {
  (
    globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
  ).IS_REACT_ACT_ENVIRONMENT = true;
  window.scrollTo = vi.fn();
});

afterEach(() => {
  document.head.innerHTML = '';
  document.body.innerHTML = '';
});

describe('v1 hydration', () => {
  it.each([
    '/',
    '/documentation/usage',
    '/api/builder',
    '/demo',
    '/recipes/server-side-filtering',
  ])(
    'hydrates the styled static output for %s without a mismatch',
    async (path) => {
      window.history.replaceState({}, '', `/v1${path === '/' ? '' : path}`);

      const page = renderPage(path);
      const recoverableErrors: unknown[] = [];

      document.head.innerHTML = page.styles;
      document.body.innerHTML = `<div id="root">${page.html}</div>`;

      const styleBeforeHydration =
        document.head.querySelector('style[data-styled]')?.textContent;
      const rootElement = document.getElementById('root');

      expect(rootElement).not.toBeNull();

      const root = hydrateRoot(rootElement!, <V1App />, {
        onRecoverableError: (error) => recoverableErrors.push(error),
      });

      await act(async () => {
        await Promise.resolve();
      });

      const hydratedStyles = [
        ...document.head.querySelectorAll('style[data-styled]'),
      ].map(({ textContent }) => textContent);

      expect(recoverableErrors).toEqual([]);
      expect(hydratedStyles).toContain(styleBeforeHydration);

      await act(async () => root.unmount());
    }
  );
});
