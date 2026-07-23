import * as React from 'react';
import type { ReactNode } from 'react';
import { hydrateRoot } from 'react-dom/client';

export const hydrateApp = (app: ReactNode): void => {
  const rootElement = document.getElementById('root');

  if (!rootElement) {
    throw new Error('Root element not found');
  }

  hydrateRoot(rootElement, app, {
    onRecoverableError: (error, errorInfo) => {
      console.error(error, errorInfo.componentStack);
    },
  });
};
