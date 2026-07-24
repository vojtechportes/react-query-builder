import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { documentationBaseline } from './constants/documentation-baseline';
import { documentationPages } from './constants/documentation-pages';
import { findDocumentationPage } from './utils/find-documentation-page.util';
import { hashDocumentationContent } from './utils/hash-documentation-content.util';

describe('v2 Documentation content', () => {
  it('preserves the complete ordered route and title registry', () => {
    expect(
      documentationPages.map(({ path, title }) => ({ path, title }))
    ).toEqual(
      documentationBaseline.map(({ path, title }) => ({ path, title }))
    );
  });

  it('preserves the normalized raw content for every route', async () => {
    for (const { path, contentHash } of documentationBaseline) {
      const page = findDocumentationPage(path);
      const content = renderToStaticMarkup(
        <StaticRouter location={path}>{page.content}</StaticRouter>
      ).replace(/ class="[^"]*"/g, '');

      await expect(hashDocumentationContent(content)).resolves.toBe(
        contentHash
      );
    }
  });

  it('normalizes trailing slashes and preserves the overview fallback', () => {
    expect(
      findDocumentationPage('/documentation/dynamic-field-options/').path
    ).toBe('/documentation/dynamic-field-options');
    expect(findDocumentationPage('/documentation/unknown').path).toBe(
      '/documentation'
    );
  });

  it.each([
    [
      '/documentation/installation',
      'npm install @vojtechportes/react-query-builder',
    ],
    ['/documentation/parsing-and-formatting/supported-formats', 'formatQuery'],
    ['/documentation/parsing-and-formatting/supported-formats', 'parseQuery'],
    ['/documentation/text-mode', '@vojtechportes/react-query-builder/monaco'],
    [
      '/documentation/adapters/mui',
      '@vojtechportes/react-query-builder/mui/v9',
    ],
    ['/documentation/theming', 'ThemeProvider'],
    [
      '/documentation/localization',
      '@vojtechportes/react-query-builder/locale/fr-FR',
    ],
  ])('preserves the frozen %s code sample', (path, sample) => {
    const content = renderToStaticMarkup(
      <StaticRouter location={path}>
        {findDocumentationPage(path).content}
      </StaticRouter>
    );

    expect(content).toContain(sample);
  });
});
