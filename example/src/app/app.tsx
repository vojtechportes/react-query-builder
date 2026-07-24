import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';
import type { IAppContentPages } from './types/app-content-pages';
import { AppRoutes } from './app-routes';
import { routerBasename } from './router-basename';

export const App: React.FC<IAppContentPages> = ({
  apiPage,
  demoPage,
  documentationPage,
  homePage,
  recipesPage,
}) => (
  <BrowserRouter basename={routerBasename}>
    <AppRoutes
      apiPage={apiPage}
      demoPage={demoPage}
      documentationPage={documentationPage}
      homePage={homePage}
      recipesPage={recipesPage}
    />
  </BrowserRouter>
);
