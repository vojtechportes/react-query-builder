import * as React from 'react';
import { renderApp } from '../shared/ssr/render-app.util';
import { V2AppRoutes } from './app/v2-app-routes';
import { v2RouteManifest } from './app/constants/v2-route-manifest';
import { v2RouterBasename } from './app/v2-router-basename';

export const renderPage = (pathname: string) =>
  renderApp(pathname, v2RouterBasename, <V2AppRoutes />);

export { v2RouteManifest };
