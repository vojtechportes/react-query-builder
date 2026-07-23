import * as React from 'react';
import type { ReactNode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { ServerStyleSheet } from 'styled-components';
import type { IRenderedPage } from './types/rendered-page';

export const renderApp = (
  pathname: string,
  basename: string | undefined,
  app: ReactNode
): IRenderedPage => {
  const sheet = new ServerStyleSheet();
  const location = `${basename ?? ''}${pathname}`;

  try {
    const html = renderToString(
      sheet.collectStyles(
        <StaticRouter basename={basename} location={location}>
          {app}
        </StaticRouter>
      )
    );

    return { html, styles: sheet.getStyleTags() };
  } finally {
    sheet.seal();
  }
};
