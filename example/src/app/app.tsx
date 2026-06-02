import * as React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { SiteShell } from '../components/site-shell';

const HomePage = React.lazy(() =>
  import('../pages/home-page/home-page').then(module => ({
    default: module.HomePage,
  }))
);
const DocumentationPage = React.lazy(() =>
  import('../pages/documentation-page/documentation-page').then(module => ({
    default: module.DocumentationPage,
  }))
);
const ApiPage = React.lazy(() =>
  import('../pages/api-page/api-page').then(module => ({
    default: module.ApiPage,
  }))
);
const DemoPage = React.lazy(() =>
  import('../pages/demo-page/demo-page').then(module => ({
    default: module.DemoPage,
  }))
);

const basename =
  import.meta.env.BASE_URL === '/'
    ? undefined
    : import.meta.env.BASE_URL.replace(/\/$/, '');

export const App: React.FC = () => (
  <BrowserRouter basename={basename}>
    <React.Suspense fallback={null}>
      <Routes>
        <Route element={<SiteShell />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/demo" element={<DemoPage />} />
          <Route path="/api" element={<ApiPage />} />
          <Route path="/api/builder" element={<ApiPage />} />
          <Route path="/api/builder-ref" element={<ApiPage />} />
          <Route path="/api/fields" element={<ApiPage />} />
          <Route path="/api/data" element={<ApiPage />} />
          <Route path="/api/builder-props" element={<Navigate to="/api/builder" replace />} />
          <Route path="/api/components" element={<ApiPage />} />
          <Route path="/api/adapters" element={<ApiPage />} />
          <Route path="/api/adapters/mui" element={<ApiPage />} />
          <Route path="/api/adapters/antd" element={<ApiPage />} />
          <Route path="/api/adapters/bootstrap" element={<ApiPage />} />
          <Route path="/api/adapters/mantine" element={<ApiPage />} />
          <Route path="/api/adapters/fluentui" element={<ApiPage />} />
          <Route path="/api/theming" element={<ApiPage />} />
          <Route path="/api/format-query" element={<ApiPage />} />
          <Route path="/api/parse-query" element={<ApiPage />} />
          <Route path="/documentation" element={<DocumentationPage />} />
          <Route path="/documentation/installation" element={<DocumentationPage />} />
          <Route path="/documentation/usage" element={<DocumentationPage />} />
          <Route path="/documentation/builder-ref" element={<DocumentationPage />} />
          <Route path="/documentation/validation" element={<DocumentationPage />} />
          <Route path="/documentation/history" element={<DocumentationPage />} />
          <Route path="/documentation/builder-behavior" element={<DocumentationPage />} />
          <Route path="/documentation/text-mode" element={<DocumentationPage />} />
          <Route
            path="/documentation/locking-and-read-only"
            element={<DocumentationPage />}
          />
          <Route path="/documentation/components" element={<DocumentationPage />} />
          <Route path="/documentation/adapters" element={<DocumentationPage />} />
          <Route path="/documentation/adapters/mui" element={<DocumentationPage />} />
          <Route path="/documentation/adapters/antd" element={<DocumentationPage />} />
          <Route
            path="/documentation/adapters/bootstrap"
            element={<DocumentationPage />}
          />
          <Route
            path="/documentation/adapters/mantine"
            element={<DocumentationPage />}
          />
          <Route
            path="/documentation/adapters/fluentui"
            element={<DocumentationPage />}
          />
          <Route
            path="/documentation/parsing-and-formatting"
            element={<DocumentationPage />}
          />
          <Route
            path="/documentation/parsing-and-formatting/sql"
            element={
              <Navigate
                to="/documentation/parsing-and-formatting/supported-formats"
                replace
              />
            }
          />
          <Route
            path="/documentation/parsing-and-formatting/mongo"
            element={
              <Navigate
                to="/documentation/parsing-and-formatting/supported-formats"
                replace
              />
            }
          />
          <Route
            path="/documentation/parsing-and-formatting/other-formats"
            element={
              <Navigate
                to="/documentation/parsing-and-formatting/supported-formats"
                replace
              />
            }
          />
          <Route
            path="/documentation/parsing-and-formatting/supported-formats"
            element={<DocumentationPage />}
          />
          <Route
            path="/documentation/configuration/fields"
            element={<Navigate to="/api/fields" replace />}
          />
          <Route
            path="/documentation/configuration/data"
            element={<Navigate to="/api/data" replace />}
          />
          <Route
            path="/documentation/configuration/builder-props"
            element={<Navigate to="/api/builder" replace />}
          />
          <Route
            path="/documentation/configuration/components"
            element={<Navigate to="/documentation/components" replace />}
          />
          <Route path="/documentation/theming" element={<DocumentationPage />} />
          <Route
            path="/documentation/localization"
            element={<DocumentationPage />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </React.Suspense>
  </BrowserRouter>
);
