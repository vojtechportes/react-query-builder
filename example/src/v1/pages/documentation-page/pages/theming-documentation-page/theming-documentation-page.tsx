import * as React from 'react';
import type { IDocumentationPage } from '../../types/documentation-page';
import { ThemingDocumentationContent } from './components/theming-documentation-content';

export const themingDocumentationPage: IDocumentationPage = {
  path: '/documentation/theming',
  title: 'Theming',
  sectionKey: 'customization',
  sectionTitle: 'Customization',
  summary: '',
  description:
    'Documentation for customizing builder colors with ThemeProvider and shared theme tokens.',
  searchText:
    'Theming theme provider colors primary secondary grey tokens design system',
  content: <ThemingDocumentationContent />,
};
