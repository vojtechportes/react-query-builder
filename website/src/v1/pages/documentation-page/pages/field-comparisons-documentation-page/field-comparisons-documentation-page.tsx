import * as React from 'react';
import type { IDocumentationPage } from '../../types/documentation-page';
import { FieldComparisonsDocumentationContent } from './components/field-comparisons-documentation-content';

export const fieldComparisonsDocumentationPage: IDocumentationPage = {
  path: '/documentation/field-comparisons',
  title: 'Field Comparisons',
  sectionKey: 'getting-started',
  sectionTitle: 'Getting Started',
  summary: '',
  description:
    'Enable rules that compare one field against another field, including configuration, data shape, and format support.',
  searchText:
    'field comparisons field-to-field allowFieldComparisons valueSource valueField comparableFields fieldComparison formatQuery parseQuery',
  content: <FieldComparisonsDocumentationContent />,
};
