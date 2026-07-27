import * as React from 'react';
import type { IDocumentationPage } from '../../types/documentation-page';
import { TextModeDocumentationContent } from './components/text-mode-documentation-content';

export const textModeDocumentationPage: IDocumentationPage = {
  path: '/documentation/text-mode',
  title: 'Text Mode',
  sectionKey: 'customization',
  sectionTitle: 'Customization',
  summary: '',
  description:
    'Documentation for SQL text mode, syntax and semantic validation, default mode selection, and the optional Monaco text editor integration.',
  searchText:
    'Text mode SQL text editor monaco createMonacoComponents syntax highlighting syntax validation semantic validation locked rules locked groups defaultMode singleRootGroup',
  content: <TextModeDocumentationContent />,
};
