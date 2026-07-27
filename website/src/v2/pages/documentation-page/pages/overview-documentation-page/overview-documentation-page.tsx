import * as React from 'react';
import type { IDocumentationPage } from '../../types/documentation-page';
import { OverviewDocumentationContent } from './components/overview-documentation-content';

export const overviewDocumentationPage: IDocumentationPage = {
  path: '/documentation',
  title: 'Documentation Overview',
  sectionKey: 'overview',
  sectionTitle: 'Documentation',
  summary: '',
  description:
    'Documentation overview for installation, usage, parsing and formatting, customization, adapters, and localization.',
  searchText:
    'Documentation overview installation usage parsing formatting configuration theming localization adapters bootstrap demo query builder react library website',
  content: <OverviewDocumentationContent />,
};
