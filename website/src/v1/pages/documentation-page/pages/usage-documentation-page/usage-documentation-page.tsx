import * as React from 'react';
import type { IDocumentationPage } from '../../types/documentation-page';
import { UsageDocumentationContent } from './components/usage-documentation-content';

export const usageDocumentationPage: IDocumentationPage = {
  path: '/documentation/usage',
  title: 'Usage',
  sectionKey: 'getting-started',
  sectionTitle: 'Getting Started',
  summary: '',
  description:
    'Basic controlled usage with Builder, field definitions, query data, and onChange handling.',
  searchText:
    'Usage Builder controlled component fields data onChange React useState denormalized query query builder example',
  content: <UsageDocumentationContent />,
};
