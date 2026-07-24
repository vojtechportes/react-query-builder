import * as React from 'react';
import type { IDocumentationPage } from '../../types/documentation-page';
import { InstallationDocumentationContent } from './components/installation-documentation-content';

export const installationDocumentationPage: IDocumentationPage = {
  path: '/documentation/installation',
  title: 'Installation',
  sectionKey: 'getting-started',
  sectionTitle: 'Getting Started',
  summary: '',
  description:
    'Package installation details for React Query Builder and React version requirements.',
  searchText:
    'Installation npm install React Query Builder react 18 peer dependencies package import library',
  content: <InstallationDocumentationContent />,
};
