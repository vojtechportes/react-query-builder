import * as React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { SiteShell } from '../../components/site-shell';
import { v1TopNavigation } from '../navigation/constants/v1-top-navigation';
import { ApiPage } from '../pages/api-page/api-page';
import { DemoPage } from '../pages/demo-page/demo-page';
import { DocumentationPage } from '../pages/documentation-page/documentation-page';
import { HomePage } from '../pages/home-page/home-page';
import { RecipesPage } from '../pages/recipes-page/recipes-page';
import { v1FallbackRoute } from './constants/v1-fallback-route';
import { v1LegacyRouteRedirects } from './constants/v1-legacy-route-redirects';
import { v1RouteManifest } from './constants/v1-route-manifest';

export const V1AppRoutes: React.FC = () => {
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
        element={<SiteShell version="v1" topNavigation={v1TopNavigation} />}
      >
        {v1RouteManifest.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={pageElements[route.section]}
          />
        ))}
        {v1LegacyRouteRedirects.map((redirect) => (
          <Route
            key={redirect.from}
            path={redirect.from}
            element={<Navigate to={redirect.to} replace />}
          />
        ))}
        <Route
          path={v1FallbackRoute.path}
          element={<Navigate to={v1FallbackRoute.to} replace />}
        />
      </Route>
    </Routes>
  );
};
