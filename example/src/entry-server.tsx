import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { ServerStyleSheet } from 'styled-components';
import { AppRoutes } from './app/app-routes';
import { routerBasename } from './app/router-basename';

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
          <AppRoutes />
        </StaticRouter>
      )
    );

    return { html, styles: sheet.getStyleTags() };
  } finally {
    sheet.seal();
  }
};
