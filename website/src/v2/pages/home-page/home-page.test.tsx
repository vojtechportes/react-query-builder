/* @vitest-environment jsdom */

import * as React from 'react';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { afterEach, describe, expect, it, vi } from 'vitest';
vi.mock('../../../components/client-only', () => ({
  ClientOnly: ({ label }: { label: string }) => (
    <div data-client-only-placeholder="true">{label}</div>
  ),
}));

import { HomePage } from './home-page';

afterEach(cleanup);

describe('v2 HomePage', () => {
  it('renders the crawlable product overview, quick start, links, and metadata', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'React Query Builder',
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/An open source React component/)
    ).toHaveTextContent('convert queries to SQL, MongoDB, Prisma');
    expect(
      screen.getByRole('link', { name: 'Try the live demo' })
    ).toHaveAttribute('href', '/demo');
    expect(screen.getByRole('link', { name: 'Get started' })).toHaveAttribute(
      'href',
      '/documentation/usage'
    );
    expect(
      screen.getByRole('heading', { name: 'Build and convert complex queries' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Add the query builder to your app' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Edit queries visually or as text' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Match your design system' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Explore text mode' })
    ).toHaveAttribute('href', '/documentation/text-mode');
    expect(
      screen.getByRole('link', { name: 'See more UI adapters' })
    ).toHaveAttribute('href', '/documentation/adapters');
    expect(
      screen.getByText('Loading the text mode query builder...')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Loading the MUI query builder...')
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/Build filters visually/)
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Create a controlled builder' })
    ).toBeInTheDocument();
    const quickStartCodeBlock = screen.getByText(
      'React Query Builder TypeScript example'
    ).parentElement?.parentElement;
    expect(quickStartCodeBlock).toHaveTextContent(
      "import { useState } from 'react';"
    );
    expect(
      screen.getByRole('heading', { name: 'Use it in real applications' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Build a Prisma filter UI' })
    ).toHaveAttribute('href', '/recipes/prisma-filter-ui');
    expect(
      screen.getByRole('heading', { name: 'Install' })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Add the package and continue with the setup guide in the documentation.'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText('npm install @vojtechportes/react-query-builder')
    ).toBeInTheDocument();
    expect(document.title).toBe('React Query Builder');
  });
});
