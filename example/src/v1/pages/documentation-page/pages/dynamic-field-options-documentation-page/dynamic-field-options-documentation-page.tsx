import * as React from 'react';
import type { IDocumentationPage } from '../../types/documentation-page';
import { DynamicFieldOptionsDocumentationContent } from './components/dynamic-field-options-documentation-content';

export const dynamicFieldOptionsDocumentationPage: IDocumentationPage = {
  path: '/documentation/dynamic-field-options',
  title: 'Dynamic Field Options',
  sectionKey: 'getting-started',
  sectionTitle: 'Getting Started',
  summary: '',
  description:
    'Documentation for field-scoped and rule-scoped imperative list options, including shared-option and dependency-aware live demos plus a TanStack React Query example.',
  searchText:
    'dynamic field options builderRef subscribe subscribeToRuleDependencies useBuilderRuleDependencies setFieldOptions setRuleOptions getNearestField invalidateFieldOptions invalidateRuleOptions clearFieldOptions clearRuleOptions getFieldOptionState getRuleOptionState onFieldChange onRuleOptionsReload tanstack react-query async select options live demo',
  content: <DynamicFieldOptionsDocumentationContent />,
};
