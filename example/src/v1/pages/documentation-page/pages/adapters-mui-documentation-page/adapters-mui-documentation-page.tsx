import * as React from 'react';
import type { IDocumentationPage } from '../../types/documentation-page';
import { AdaptersMuiDocumentationContent } from './components/adapters-mui-documentation-content';

export const adaptersMuiDocumentationPage: IDocumentationPage = {
  path: '/documentation/adapters/mui',
  title: 'MUI',
  depth: 1,
  sectionKey: 'customization',
  sectionTitle: 'Customization',
  summary: '',
  description:
    'Documentation for the Material UI adapter, including mui/v9, legacy mui/v7 support, installation, and component merging.',
  searchText:
    'MUI adapter material ui mui v9 mui v7 adapter install createMuiComponents components',
  content: <AdaptersMuiDocumentationContent />,
};
