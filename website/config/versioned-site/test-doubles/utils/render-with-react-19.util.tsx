import { getQueriesForElement } from '@testing-library/dom';
import { act, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { mountedReact19Roots } from '../constants/mounted-react-19-roots';

export const renderWithReact19 = (ui: ReactNode) => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  mountedReact19Roots.set(container, root);

  act(() => root.render(ui));

  return {
    container,
    baseElement: document.body,
    ...getQueriesForElement(container),
    rerender: (nextUi: ReactNode): void => {
      act(() => root.render(nextUi));
    },
    unmount: (): void => {
      if (!mountedReact19Roots.has(container)) {
        return;
      }

      act(() => root.unmount());
      mountedReact19Roots.delete(container);
    },
  };
};
