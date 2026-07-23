import * as React from 'react';
import { hydrateRoot } from 'react-dom/client';
import { App } from './app/app';
import { reportRecoverableError } from './report-recoverable-error';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

hydrateRoot(rootElement, <App />, {
  onRecoverableError: reportRecoverableError,
});
