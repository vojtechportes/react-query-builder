import * as React from 'react';
import type { IDocumentationPage } from '../../types/documentation-page';
import { AdaptersBootstrapDocumentationContent } from './components/adapters-bootstrap-documentation-content';

export const adaptersBootstrapDocumentationPage: IDocumentationPage = {
  path: '/documentation/adapters/bootstrap',
  title: 'Bootstrap',
  depth: 1,
  sectionKey: 'customization',
  sectionTitle: 'Customization',
  summary: '',
  description:
    'Documentation for the Bootstrap adapter, including bootstrap/v5 installation, stylesheet setup, usage, and component merging.',
  searchText:
    'Bootstrap adapter bootstrap v5 adapter install stylesheet createBootstrapComponents components',
  content: <AdaptersBootstrapDocumentationContent />,
};
