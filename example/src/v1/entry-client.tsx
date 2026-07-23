import * as React from 'react';
import { App } from '../app/app';
import { hydrateApp } from '../shared/client/hydrate-app.util';
import { DemoPage } from './pages/demo-page/demo-page';
import { HomePage } from './pages/home-page/home-page';
import { DocumentationPage } from './pages/documentation-page/documentation-page';

hydrateApp(
  <App
    demoPage={<DemoPage />}
    documentationPage={<DocumentationPage />}
    homePage={<HomePage />}
  />
);
