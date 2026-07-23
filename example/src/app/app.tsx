import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './app-routes';
import { routerBasename } from './router-basename';

export const App: React.FC = () => (
  <BrowserRouter basename={routerBasename}>
    <AppRoutes />
  </BrowserRouter>
);
