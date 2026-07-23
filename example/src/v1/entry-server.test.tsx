import { describe, expect, it } from 'vitest';
import { renderPage } from './entry-server';

describe('v1 Home and Demo SSR', () => {
  it('renders the frozen Home copy with styled-components output', () => {
    const page = renderPage('/');

    expect(page.html).toContain('<h1');
    expect(page.html).toContain('React Query Builder');
    expect(page.html).toContain('Highly configurable TypeScript library');
    expect(page.html).toContain(
      'npm install @vojtechportes/react-query-builder'
    );
    expect(page.styles).toContain('data-styled="true"');
  });

  it('renders the frozen Demo copy and client-only placeholder', () => {
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
});
