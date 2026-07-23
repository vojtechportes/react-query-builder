import * as React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { SiteShell } from '../components/site-shell';
import { canonicalSeoPages } from '../constants/seo-pages';
import { ApiPage } from '../pages/api-page/api-page';
import { DocumentationPage } from '../pages/documentation-page/documentation-page';
import { RecipesPage } from '../pages/recipes-page/recipes-page';
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
  demoPage,
  homePage,
}) => {
  const pageElements = {
    API: <ApiPage />,
    Demo: demoPage,
    Documentation: <DocumentationPage />,
    Home: homePage,
    Recipes: <RecipesPage />,
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
