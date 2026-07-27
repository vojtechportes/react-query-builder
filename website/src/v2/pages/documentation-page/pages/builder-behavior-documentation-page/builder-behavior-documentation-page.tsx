import * as React from 'react';
import type { IDocumentationPage } from '../../types/documentation-page';
import { BuilderBehaviorDocumentationContent } from './components/builder-behavior-documentation-content';

export const builderBehaviorDocumentationPage: IDocumentationPage = {
  path: '/documentation/builder-behavior',
  title: 'Builder Behavior',
  sectionKey: 'getting-started',
  sectionTitle: 'Getting Started',
  summary: '',
  description:
    'Documentation for clone controls, drag-and-drop, insertion placement, root-group behavior, and group mode configuration.',
  searchText:
    'builder behavior cloneable clone controls draggable drag and drop allowGroupNegation group negation not groups readOnlyProtectsDelete newNodePlacement append prepend singleRootGroup groupTypes with modifiers without modifiers both root group',
  content: <BuilderBehaviorDocumentationContent />,
};
