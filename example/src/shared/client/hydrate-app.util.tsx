import * as React from 'react';
import type { ReactNode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';

export const hydrateApp = (app: ReactNode): void => {
  const rootElement = document.getElementById('root');

  if (!rootElement) {
    throw new Error('Root element not found');
  }

  if (!rootElement.hasChildNodes()) {
    createRoot(rootElement).render(app);

    return;
  }

  hydrateRoot(rootElement, app, {
    onRecoverableError: (error, errorInfo) => {
      console.error(error, errorInfo.componentStack);
    },
  });
};
