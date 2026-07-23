import * as React from 'react';
import { AppRoutes } from '../app/app-routes';
import { routerBasename } from '../app/router-basename';
import { renderApp } from '../shared/ssr/render-app.util';

export const renderPage = (pathname: string) =>
  renderApp(pathname, routerBasename, <AppRoutes />);
