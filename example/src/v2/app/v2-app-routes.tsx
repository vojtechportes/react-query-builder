import * as React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { SiteShell } from '../../components/site-shell';
import { v2TopNavigation } from '../navigation/constants/v2-top-navigation';
import { ApiPage } from '../pages/api-page/api-page';
import { DemoPage } from '../pages/demo-page/demo-page';
import { DocumentationPage } from '../pages/documentation-page/documentation-page';
import { HomePage } from '../pages/home-page/home-page';
import { RecipesPage } from '../pages/recipes-page/recipes-page';
import { v2FallbackRoute } from './constants/v2-fallback-route';
import { v2LegacyRouteRedirects } from './constants/v2-legacy-route-redirects';
import { v2RouteManifest } from './constants/v2-route-manifest';

export const V2AppRoutes: React.FC = () => {
  const pageElements = {
    API: <ApiPage />,
    Demo: <DemoPage />,
    Documentation: <DocumentationPage />,
    Home: <HomePage />,
    Recipes: <RecipesPage />,
  };

  return (
    <Routes>
      <Route
        element={
          <SiteShell versionLabel="Docs v2" topNavigation={v2TopNavigation} />
        }
      >
        {v2RouteManifest.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={pageElements[route.section]}
          />
        ))}
        {v2LegacyRouteRedirects.map((redirect) => (
          <Route
            key={redirect.from}
            path={redirect.from}
            element={<Navigate to={redirect.to} replace />}
          />
        ))}
        <Route
          path={v2FallbackRoute.path}
          element={<Navigate to={v2FallbackRoute.to} replace />}
        />
      </Route>
    </Routes>
  );
};
