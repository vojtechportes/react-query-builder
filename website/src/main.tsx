import * as React from 'react';
import { hydrateRoot } from 'react-dom/client';
import { App } from './app/app';
import { ApiPage } from './pages/api-page/api-page';
import { DemoPage } from './pages/demo-page/demo-page';
import { HomePage } from './pages/home-page/home-page';
import { RecipesPage } from './pages/recipes-page/recipes-page';
import { DocumentationPage } from './pages/documentation-page/documentation-page';
import { reportRecoverableError } from './report-recoverable-error';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

hydrateRoot(
  rootElement,
  <App
    apiPage={<ApiPage />}
    demoPage={<DemoPage />}
    documentationPage={<DocumentationPage />}
    homePage={<HomePage />}
    recipesPage={<RecipesPage />}
  />,
  {
    onRecoverableError: reportRecoverableError,
  }
);
