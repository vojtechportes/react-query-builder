import * as React from 'react';
import type { IDocumentationPage } from '../../types/documentation-page';
import { AdaptersFluentuiDocumentationContent } from './components/adapters-fluentui-documentation-content';

export const adaptersFluentuiDocumentationPage: IDocumentationPage = {
  path: '/documentation/adapters/fluentui',
  title: 'Fluent UI',
  depth: 1,
  sectionKey: 'customization',
  sectionTitle: 'Customization',
  summary: '',
  description:
    'Documentation for the Fluent UI adapter, including fluentui/v8 installation, usage, and component merging.',
  searchText:
    'Fluent UI adapter fluentui v8 adapter install createFluentUiComponents components',
  content: <AdaptersFluentuiDocumentationContent />,
};
