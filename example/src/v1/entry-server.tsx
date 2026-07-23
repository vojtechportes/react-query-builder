import * as React from 'react';
import { AppRoutes } from '../app/app-routes';
import { routerBasename } from '../app/router-basename';
import { renderApp } from '../shared/ssr/render-app.util';
import { DemoPage } from './pages/demo-page/demo-page';
import { HomePage } from './pages/home-page/home-page';
import { DocumentationPage } from './pages/documentation-page/documentation-page';

export const renderPage = (pathname: string) =>
  renderApp(
    pathname,
    routerBasename,
    <AppRoutes
      demoPage={<DemoPage />}
      documentationPage={<DocumentationPage />}
      homePage={<HomePage />}
    />
  );
