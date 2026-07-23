import { describe, expect, it } from 'vitest';
import { documentationBaseline } from './pages/documentation-page/constants/documentation-baseline';
import { renderPage } from './entry-server';

describe('v2 version-owned SSR', () => {
  it('renders the v2-owned Home copy with styled-components output', () => {
    const page = renderPage('/');

    expect(page.html).toContain('<h1');
    expect(page.html).toContain('React Query Builder');
    expect(page.html).toContain('Highly configurable TypeScript library');
    expect(page.html).toContain(
      'npm install @vojtechportes/react-query-builder'
    );
    expect(page.styles).toContain('data-styled="true"');
  });

  it('renders the v2-owned Demo copy and client-only placeholder', () => {
    const page = renderPage('/demo');

    expect(page.html).toContain('>Demo</h1>');
    expect(page.html).toContain(
      'Configure fields, adapters, validation, text editing, localization, and query output'
    );
    expect(page.html).toContain('data-client-only-placeholder="true"');
    expect(page.html).toContain(
      'Loading the interactive query builder playground...'
    );
    expect(page.styles).toContain('data-styled="true"');
  });

  it.each(documentationBaseline)(
    'renders the v2-owned Documentation content for $path',
    ({ path, title }) => {
      const page = renderPage(path);

      expect(page.html).toContain(`>${title}</h1>`);
      expect(page.styles).toContain('data-styled="true"');
    }
  );

  it('renders the parsing sandbox client-only boundary', () => {
    const page = renderPage('/documentation/parsing-and-formatting');

    expect(page.html).toContain('data-client-only-placeholder="true"');
    expect(page.html).toContain('Loading the interactive parsing sandbox...');
  });
});
