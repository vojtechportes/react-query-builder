import * as React from 'react';
import type { IDocumentationPage } from '../../types/documentation-page';
import { AdaptersAntdDocumentationContent } from './components/adapters-antd-documentation-content';

export const adaptersAntdDocumentationPage: IDocumentationPage = {
  path: '/documentation/adapters/antd',
  title: 'ANTD',
  depth: 1,
  sectionKey: 'customization',
  sectionTitle: 'Customization',
  summary: '',
  description:
    'Documentation for the Ant Design adapter, including antd/v6, legacy antd/v5 support, installation, and component merging.',
  searchText:
    'ANTD adapter ant design antd v6 antd v5 adapter install createAntdComponents components',
  content: <AdaptersAntdDocumentationContent />,
};
