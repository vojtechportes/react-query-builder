import * as React from 'react';
import type { IDocumentationPage } from '../../types/documentation-page';
import { AdaptersRadixDocumentationContent } from './components/adapters-radix-documentation-content';

export const adaptersRadixDocumentationPage: IDocumentationPage = {
  path: '/documentation/adapters/radix',
  title: 'Radix',
  depth: 1,
  sectionKey: 'customization',
  sectionTitle: 'Customization',
  summary: '',
  description:
    'Documentation for the Radix Themes adapter, including radix/v1 installation, provider setup, usage, and component merging.',
  searchText:
    'Radix adapter radix themes radix v1 adapter install Theme createRadixComponents components',
  content: <AdaptersRadixDocumentationContent />,
};
