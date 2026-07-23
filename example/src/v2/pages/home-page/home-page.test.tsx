/* @vitest-environment jsdom */

import * as React from 'react';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it } from 'vitest';
import { HomePage } from './home-page';

afterEach(cleanup);

describe('v2 HomePage', () => {
  it('renders the v2-owned landing-page copy, links, install command, and metadata', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', { level: 1, name: 'React Query Builder' })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Highly configurable TypeScript library/)
    ).toHaveTextContent(
      'parsing and formatting across supported query syntaxes.'
    );
    expect(screen.getByRole('link', { name: 'Documentation' })).toHaveAttribute(
      'href',
      '/documentation'
    );
    expect(screen.getByRole('link', { name: 'Demo' })).toHaveAttribute(
      'href',
      '/demo'
    );
    expect(
      screen.getByText('npm install @vojtechportes/react-query-builder')
    ).toBeInTheDocument();
    expect(document.title).toBe(
      'React Query Builder for TypeScript Apps | React Query Builder'
    );
  });
});
