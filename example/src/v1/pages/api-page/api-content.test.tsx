import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { apiBaseline } from './constants/api-baseline';
import { apiGroups } from './constants/api-groups';
import { apiPages } from './constants/api-pages';
import { findApiPage } from './utils/find-api-page.util';
import { hashApiContent } from './utils/hash-api-content.util';

describe('v1 API content', () => {
  it('preserves the complete ordered route and title registry', () => {
    expect(apiPages.map(({ path, title }) => ({ path, title }))).toEqual(
      apiBaseline.map(({ path, title }) => ({ path, title }))
    );
  });

  it('preserves the API sidebar groups and route order', () => {
    expect(
      apiGroups.map(({ title, pages }) => ({
        title,
        paths: pages.map(({ path }) => path),
      }))
    ).toEqual([
      {
        title: 'Core API',
        paths: ['/api/builder', '/api/builder-ref', '/api/fields', '/api/data'],
      },
      {
        title: 'Customization',
        paths: [
          '/api/components',
          '/api/adapters',
          '/api/adapters/mui',
          '/api/adapters/antd',
          '/api/adapters/fluentui',
          '/api/adapters/mantine',
          '/api/adapters/bootstrap',
          '/api/adapters/radix',
          '/api/theming',
        ],
      },
      {
        title: 'Query Conversion',
        paths: ['/api/format-query', '/api/parse-query'],
      },
    ]);
  });

  it('preserves the normalized raw content for every route', async () => {
    for (const { path, contentHash } of apiBaseline) {
      const content = renderToStaticMarkup(
        <StaticRouter location={path}>{findApiPage(path).content}</StaticRouter>
      ).replace(/ class="[^"]*"/g, '');

      await expect(hashApiContent(content)).resolves.toBe(contentHash);
    }
  });

  it('normalizes trailing slashes and preserves the overview fallback', () => {
    expect(findApiPage('/api/adapters/mui///').path).toBe('/api/adapters/mui');
    expect(findApiPage('/api/unknown').path).toBe('/api');
  });

  it.each([
    ['/api/builder', 'IBuilderProps'],
    ['/api/builder-ref', 'IBuilderRef'],
    ['/api/fields', 'BuilderFieldType'],
    ['/api/data', 'QueryGroupValue'],
    ['/api/components', 'IBuilderComponentsProps'],
    ['/api/adapters/mui', 'react-query-builder/mui/v9'],
    ['/api/adapters/antd', 'react-query-builder/antd/v6'],
    ['/api/adapters/fluentui', 'react-query-builder/fluentui/v8'],
    ['/api/adapters/mantine', 'react-query-builder/mantine/v9'],
    ['/api/adapters/bootstrap', 'react-query-builder/bootstrap/v5'],
    ['/api/adapters/radix', 'react-query-builder/radix/v1'],
    ['/api/theming', 'ThemeProvider'],
    ['/api/format-query', 'formatQuery'],
    ['/api/parse-query', 'parseQuery'],
  ])('preserves the frozen %s signature or example', (path, sample) => {
    const content = renderToStaticMarkup(
      <StaticRouter location={path}>{findApiPage(path).content}</StaticRouter>
    );

    expect(content).toContain(sample);
  });
});
