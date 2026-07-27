import * as React from 'react';
import type { IDocumentationPage } from '../../types/documentation-page';
import { MigrationTo20DocumentationContent } from './components/migration-to-2-0-documentation-content';

export const migrationTo20DocumentationPage: IDocumentationPage = {
  path: '/documentation/migration-to-2-0',
  title: 'Migration to 2.0',
  sectionKey: 'getting-started',
  sectionTitle: 'Getting Started',
  summary: '',
  description:
    'Migrate React Query Builder 1.33.1 applications to version 2.0 with the explicit stylesheet, CSS tokens, and legacy API guidance.',
  searchText:
    'Migration migrate upgrade 1.33.1 2.0 stylesheet styles CSS tokens ThemeProvider colors OptionContainer versioned documentation React Query Builder',
  content: <MigrationTo20DocumentationContent />,
};
