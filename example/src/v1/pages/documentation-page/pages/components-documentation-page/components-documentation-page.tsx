import * as React from 'react';
import type { IDocumentationPage } from '../../types/documentation-page';
import { ComponentsDocumentationContent } from './components/components-documentation-content';

export const componentsDocumentationPage: IDocumentationPage = {
  path: '/documentation/components',
  title: 'Components',
  sectionKey: 'customization',
  sectionTitle: 'Customization',
  summary: '',
  description:
    'Documentation for replacing built-in builder controls and containers with custom components.',
  searchText:
    'Components component overrides custom controls custom renderers builder customization add remove select input group rule responsive responsiveness compact layout multiselect summary',
  content: <ComponentsDocumentationContent />,
};
