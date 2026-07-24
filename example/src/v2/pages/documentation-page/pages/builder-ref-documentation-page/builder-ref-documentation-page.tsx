import * as React from 'react';
import type { IDocumentationPage } from '../../types/documentation-page';
import { BuilderRefDocumentationContent } from './components/builder-ref-documentation-content';

export const builderRefDocumentationPage: IDocumentationPage = {
  path: '/documentation/builder-ref',
  title: 'Builder Ref',
  sectionKey: 'getting-started',
  sectionTitle: 'Getting Started',
  summary: '',
  description:
    'Documentation for the imperative builderRef API exposed through useBuilderRef, including reads, mutations, and history access.',
  searchText:
    'builderRef useBuilderRef forwardRef imperative api clone lock unlock delete update replace insert add move getNodeById getNodes getData getHistory setHistory undo redo',
  content: <BuilderRefDocumentationContent />,
};
