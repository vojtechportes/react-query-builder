import * as React from 'react';
import type { IDocumentationPage } from '../../types/documentation-page';
import { HistoryDocumentationContent } from './components/history-documentation-content';

export const historyDocumentationPage: IDocumentationPage = {
  path: '/documentation/history',
  title: 'Undo and Redo',
  sectionKey: 'getting-started',
  sectionTitle: 'Getting Started',
  summary: '',
  description:
    'Documentation for enabling inverse-history undo and redo, built-in controls, state callbacks, and drag-and-drop coverage.',
  searchText:
    'undo redo history inverse history maxEntries controls canUndo canRedo onStateChange drag and drop clone delete edit builder',
  content: <HistoryDocumentationContent />,
};
