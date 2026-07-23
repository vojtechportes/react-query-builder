import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';
import type { IAppContentPages } from './types/app-content-pages';
import { AppRoutes } from './app-routes';
import { routerBasename } from './router-basename';

export const App: React.FC<IAppContentPages> = ({
  demoPage,
  documentationPage,
  homePage,
}) => (
  <BrowserRouter basename={routerBasename}>
    <AppRoutes
      demoPage={demoPage}
      documentationPage={documentationPage}
      homePage={homePage}
    />
  </BrowserRouter>
);
