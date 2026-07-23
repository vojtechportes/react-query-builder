import * as React from 'react';
import type { IDocumentationPage } from '../../types/documentation-page';
import { ValidationDocumentationContent } from './components/validation-documentation-content';

export const validationDocumentationPage: IDocumentationPage = {
  path: '/documentation/validation',
  title: 'Validation',
  sectionKey: 'getting-started',
  sectionTitle: 'Getting Started',
  summary: '',
  description:
    'Built-in validation for fields and rules, structural usageLimit constraints, validation rendering with showValidation, and custom validator integration.',
  searchText:
    'Validation built-in validation validator usageLimit showValidation onStateChange required minLength maxLength minItems maxItems range validation rules fields builder',
  content: <ValidationDocumentationContent />,
};
