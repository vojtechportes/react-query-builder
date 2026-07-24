import * as React from 'react';
import type { IDocumentationPage } from '../../types/documentation-page';
import { LocalizationDocumentationContent } from './components/localization-documentation-content';

export const localizationDocumentationPage: IDocumentationPage = {
  path: '/documentation/localization',
  title: 'Localization',
  sectionKey: 'single-localization',
  sectionTitle: 'Localization',
  summary: '',
  description:
    'Documentation for localizing field labels, option labels, and built-in UI strings.',
  searchText:
    'Localization localized labels fields translated copy internationalization i18n query builder',
  content: <LocalizationDocumentationContent />,
};
