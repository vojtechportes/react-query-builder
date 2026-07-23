import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { ServerStyleSheet } from 'styled-components';
import { AppRoutes } from './app/app-routes';
import { routerBasename } from './app/router-basename';
import { DemoPage } from './pages/demo-page/demo-page';
import { HomePage } from './pages/home-page/home-page';

export interface IRenderedPage {
  html: string;
  styles: string;
}

export const renderPage = (pathname: string): IRenderedPage => {
  const sheet = new ServerStyleSheet();
  const location = `${routerBasename ?? ''}${pathname}`;

  try {
    const html = renderToString(
      sheet.collectStyles(
        <StaticRouter basename={routerBasename} location={location}>
          <AppRoutes demoPage={<DemoPage />} homePage={<HomePage />} />
        </StaticRouter>
      )
    );

    return { html, styles: sheet.getStyleTags() };
  } finally {
    sheet.seal();
  }
};
