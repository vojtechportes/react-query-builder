/* @vitest-environment jsdom */

import * as React from 'react';
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { expect, it } from 'vitest';
import { MuiBuilderSurface } from './mui-builder-surface';

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

it('isolates MUI demo content with a scoped Material UI baseline', () => {
  const container = document.createElement('div');
  const root = createRoot(container);

  act(() => {
    root.render(
      <MuiBuilderSurface>
        <button type="button">Action</button>
      </MuiBuilderSurface>
    );
  });

  expect(
    container.firstElementChild?.classList.contains('MuiScopedCssBaseline-root')
  ).toBe(true);

  act(() => root.unmount());
});
