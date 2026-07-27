import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { V1AppRoutes } from './v1-app-routes';
import { v1RouterBasename } from './v1-router-basename';

export const V1App: React.FC = () => (
  <BrowserRouter basename={v1RouterBasename}>
    <V1AppRoutes />
  </BrowserRouter>
);
