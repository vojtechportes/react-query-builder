/* @vitest-environment jsdom */

import * as React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const clientMocks = vi.hoisted(() => ({
  createRoot: vi.fn(() => ({ render: vi.fn() })),
  hydrateRoot: vi.fn(),
}));

vi.mock('react-dom/client', () => clientMocks);

import { hydrateApp } from './hydrate-app.util';

describe('hydrateApp', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="root"></div>';
    vi.clearAllMocks();
  });

  it('renders an empty development root', () => {
    hydrateApp(<span>Client app</span>);

    expect(clientMocks.createRoot).toHaveBeenCalledWith(
      document.getElementById('root')
    );
    expect(clientMocks.hydrateRoot).not.toHaveBeenCalled();
  });

  it('hydrates server-rendered markup with recoverable error reporting', () => {
    document.getElementById('root')!.innerHTML = '<span>Server app</span>';

    hydrateApp(<span>Server app</span>);

    expect(clientMocks.createRoot).not.toHaveBeenCalled();
    expect(clientMocks.hydrateRoot).toHaveBeenCalledWith(
      document.getElementById('root'),
      expect.anything(),
      expect.objectContaining({ onRecoverableError: expect.any(Function) })
    );
  });
});
