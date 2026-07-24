import type { IDocumentationGroup } from '../types/documentation-group';
import { documentationPages } from './documentation-pages';

export const documentationGroups: IDocumentationGroup[] = [
  {
    key: 'getting-started',
    title: 'Getting Started',
    pages: documentationPages.filter(
      (page) => page.sectionKey === 'getting-started'
    ),
  },
  {
    key: 'parsing',
    title: 'Parsing and Formatting',
    pages: documentationPages.filter((page) => page.sectionKey === 'parsing'),
  },
  {
    key: 'customization',
    title: 'Customization',
    pages: documentationPages.filter(
      (page) => page.sectionKey === 'customization'
    ),
  },
  {
    key: 'single-localization',
    title: 'Localization',
    pages: documentationPages.filter(
      (page) => page.sectionKey === 'single-localization'
    ),
  },
];
