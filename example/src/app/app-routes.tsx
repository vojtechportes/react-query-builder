import * as React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { SiteShell } from '../components/site-shell';
import { canonicalSeoPages } from '../constants/seo-pages';
import type { IAppContentPages } from './types/app-content-pages';

const redirects = [
  { from: '/api/builder-props', to: '/api/builder' },
  {
    from: '/documentation/parsing-and-formatting/sql',
    to: '/documentation/parsing-and-formatting/supported-formats',
  },
  {
    from: '/documentation/parsing-and-formatting/mongo',
    to: '/documentation/parsing-and-formatting/supported-formats',
  },
  {
    from: '/documentation/parsing-and-formatting/other-formats',
    to: '/documentation/parsing-and-formatting/supported-formats',
  },
  { from: '/documentation/configuration/fields', to: '/api/fields' },
  { from: '/documentation/configuration/data', to: '/api/data' },
  {
    from: '/documentation/configuration/builder-props',
    to: '/api/builder',
  },
  {
    from: '/documentation/configuration/components',
    to: '/documentation/components',
  },
] as const;

export const AppRoutes: React.FC<IAppContentPages> = ({
  apiPage,
  demoPage,
  documentationPage,
  homePage,
  recipesPage,
}) => {
  const pageElements = {
    API: apiPage,
    Demo: demoPage,
    Documentation: documentationPage,
    Home: homePage,
    Recipes: recipesPage,
  };

  return (
    <Routes>
      <Route element={<SiteShell />}>
        {canonicalSeoPages.map((page) => (
          <Route
            key={page.path}
            path={page.path}
            element={pageElements[page.section as keyof typeof pageElements]}
          />
        ))}
        {redirects.map((redirect) => (
          <Route
            key={redirect.from}
            path={redirect.from}
            element={<Navigate to={redirect.to} replace />}
          />
        ))}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};
