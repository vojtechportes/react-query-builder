/* @vitest-environment jsdom */

import * as React from 'react';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../../components/client-only', () => ({
  ClientOnly: ({ label, minHeight }: { label: string; minHeight: string }) => (
    <div data-testid="client-only" data-min-height={minHeight}>
      {label}
    </div>
  ),
}));

vi.mock('./components/demo-playground', () => ({
  DemoPlayground: () => <div>v1 playground</div>,
}));

import { DemoPlayground } from './components/demo-playground';
import { DemoPage } from './demo-page';
import { loadDemoPlayground } from './load-demo-playground';

afterEach(cleanup);

describe('v1 DemoPage', () => {
  it('preserves the v1 copy and client-only playground boundary', () => {
    render(<DemoPage />);

    expect(
      screen.getByRole('heading', { level: 1, name: 'Demo' })
    ).toBeInTheDocument();
    expect(screen.getByText(/Configure fields, adapters/)).toHaveTextContent(
      'query output in the interactive playground below.'
    );
    expect(screen.getByTestId('client-only')).toHaveTextContent(
      'Loading the interactive query builder playground...'
    );
    expect(screen.getByTestId('client-only')).toHaveAttribute(
      'data-min-height',
      '32rem'
    );
  });

  it('loads the v1-owned playground', async () => {
    const loadedModule = await loadDemoPlayground();

    expect(loadedModule.default).toBe(DemoPlayground);
  });
});
