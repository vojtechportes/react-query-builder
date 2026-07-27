import * as React from 'react';
import type { IDocumentationPage } from '../../types/documentation-page';
import { AdaptersMantineDocumentationContent } from './components/adapters-mantine-documentation-content';

export const adaptersMantineDocumentationPage: IDocumentationPage = {
  path: '/documentation/adapters/mantine',
  title: 'Mantine',
  depth: 1,
  sectionKey: 'customization',
  sectionTitle: 'Customization',
  summary: '',
  description:
    'Documentation for the Mantine adapter, including mantine/v9, legacy mantine/v8 support, installation, provider setup, and component merging.',
  searchText:
    'Mantine adapter mantine v9 mantine v8 adapter install MantineProvider createMantineComponents components',
  content: <AdaptersMantineDocumentationContent />,
};
