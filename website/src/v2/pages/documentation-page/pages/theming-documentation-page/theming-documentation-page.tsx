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
    'Documentation for typed light and dark color schemes, CSS variables, custom themes, and ThemeProvider compatibility.',
  searchText:
    'Theming light dark mode colorScheme dark-mode variables background ThemeProvider colors tokens design system',
  content: <ThemingDocumentationContent />,
};
