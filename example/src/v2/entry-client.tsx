import * as React from 'react';
import { App } from '../app/app';
import { DemoPage } from './pages/demo-page/demo-page';
import { HomePage } from './pages/home-page/home-page';
import { hydrateApp } from '../shared/client/hydrate-app.util';

hydrateApp(<App demoPage={<DemoPage />} homePage={<HomePage />} />);
