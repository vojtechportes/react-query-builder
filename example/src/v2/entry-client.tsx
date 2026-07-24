import * as React from 'react';
import { App } from '../app/app';
import { DemoPage } from './pages/demo-page/demo-page';
import { HomePage } from './pages/home-page/home-page';
import { RecipesPage } from './pages/recipes-page/recipes-page';
import { DocumentationPage } from './pages/documentation-page/documentation-page';
import { hydrateApp } from '../shared/client/hydrate-app.util';
import { ApiPage } from './pages/api-page/api-page';

hydrateApp(
  <App
    apiPage={<ApiPage />}
    demoPage={<DemoPage />}
    documentationPage={<DocumentationPage />}
    homePage={<HomePage />}
    recipesPage={<RecipesPage />}
  />
);
