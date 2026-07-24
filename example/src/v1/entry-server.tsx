import * as React from 'react';
import { AppRoutes } from '../app/app-routes';
import { routerBasename } from '../app/router-basename';
import { renderApp } from '../shared/ssr/render-app.util';
import { ApiPage } from './pages/api-page/api-page';
import { DemoPage } from './pages/demo-page/demo-page';
import { HomePage } from './pages/home-page/home-page';
import { RecipesPage } from './pages/recipes-page/recipes-page';
import { DocumentationPage } from './pages/documentation-page/documentation-page';

export const renderPage = (pathname: string) =>
  renderApp(
    pathname,
    routerBasename,
    <AppRoutes
      apiPage={<ApiPage />}
      demoPage={<DemoPage />}
      documentationPage={<DocumentationPage />}
      homePage={<HomePage />}
      recipesPage={<RecipesPage />}
    />
  );
