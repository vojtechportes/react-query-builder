import * as React from 'react';
import { hydrateRoot } from 'react-dom/client';
import { App } from './app/app';
import { DemoPage } from './pages/demo-page/demo-page';
import { HomePage } from './pages/home-page/home-page';
import { reportRecoverableError } from './report-recoverable-error';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

hydrateRoot(
  rootElement,
  <App demoPage={<DemoPage />} homePage={<HomePage />} />,
  {
    onRecoverableError: reportRecoverableError,
  }
);
