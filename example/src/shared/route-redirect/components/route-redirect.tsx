import * as React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import type { IRouteRedirectProps } from '../types/route-redirect-props';

export const RouteRedirect: React.FC<IRouteRedirectProps> = ({ to }) => {
  const { search, hash } = useLocation();

  return <Navigate replace to={{ pathname: to, search, hash }} />;
};
