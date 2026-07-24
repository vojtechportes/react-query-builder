import * as React from 'react';
import type { IDocumentationPage } from '../../types/documentation-page';
import { LockingAndReadOnlyDocumentationContent } from './components/locking-and-read-only-documentation-content';

export const lockingAndReadOnlyDocumentationPage: IDocumentationPage = {
  path: '/documentation/locking-and-read-only',
  title: 'Locking and Read-only',
  sectionKey: 'getting-started',
  sectionTitle: 'Getting Started',
  summary: '',
  description:
    'Documentation for builder-level, rule-level, and group-level read-only behavior, including targeted read-only and group inheritance semantics.',
  searchText:
    'readOnly locking locked rule group targets field operator value combinator negation inheritToChildren inheritance read only builder rule group drag delete add controls',
  content: <LockingAndReadOnlyDocumentationContent />,
};
