import type { IApiGroup } from '../types/api-group';
import { apiPages } from './api-pages';

export const apiGroups: IApiGroup[] = [
  {
    key: 'core',
    title: 'Core API',
    pages: apiPages.filter((page) => page.sectionKey === 'core'),
  },
  {
    key: 'customization',
    title: 'Customization',
    pages: apiPages.filter((page) => page.sectionKey === 'customization'),
  },
  {
    key: 'exports',
    title: 'Query Conversion',
    pages: apiPages.filter((page) => page.sectionKey === 'exports'),
  },
];
