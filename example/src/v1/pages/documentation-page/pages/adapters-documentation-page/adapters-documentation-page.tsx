import * as React from 'react';
import type { IDocumentationPage } from '../../types/documentation-page';
import { AdaptersDocumentationContent } from './components/adapters-documentation-content';

export const adaptersDocumentationPage: IDocumentationPage = {
  path: '/documentation/adapters',
  title: 'Adapters',
  sectionKey: 'customization',
  sectionTitle: 'Customization',
  summary: '',
  description:
    'Documentation overview for packaged UI adapters, versioned entrypoints, adapter-specific subpages, and shared customization patterns.',
  searchText:
    'Adapters customization mui material ui antd ant design bootstrap mantine fluent ui versioned adapter entrypoints adapter overview create components pages ready made overrides',
  content: <AdaptersDocumentationContent />,
};
