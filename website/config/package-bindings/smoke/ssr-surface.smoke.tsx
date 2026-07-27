import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { Builder } from '@vojtechportes/react-query-builder';
import { parseQuery } from '@vojtechportes/react-query-builder/parseQuery';

export const renderPackageBindingSsrSmoke = (): string =>
  renderToString(
    createElement(
      'output',
      null,
      `${typeof Builder}:${typeof parseQuery}:package-binding`
    )
  );
