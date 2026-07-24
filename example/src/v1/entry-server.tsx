import * as React from 'react';
import { renderApp } from '../shared/ssr/render-app.util';
import { V1AppRoutes } from './app/v1-app-routes';
import { v1RouterBasename } from './app/v1-router-basename';

export const renderPage = (pathname: string) =>
  renderApp(pathname, v1RouterBasename, <V1AppRoutes />);
