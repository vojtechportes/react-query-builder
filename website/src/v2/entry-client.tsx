import '@vojtechportes/react-query-builder/styles.css';
import '@vojtechportes/react-query-builder/dark-mode.variables.css';
import * as React from 'react';
import { hydrateApp } from '../shared/client/hydrate-app.util';
import { V2App } from './app/v2-app';

hydrateApp(<V2App />);
