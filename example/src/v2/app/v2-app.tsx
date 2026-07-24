import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { V2AppRoutes } from './v2-app-routes';
import { v2RouterBasename } from './v2-router-basename';

export const V2App: React.FC = () => (
  <BrowserRouter basename={v2RouterBasename}>
    <V2AppRoutes />
  </BrowserRouter>
);
