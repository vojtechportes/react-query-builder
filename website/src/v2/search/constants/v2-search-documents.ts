import { v2RouteManifest } from '../../app/constants/v2-route-manifest';
import { apiPages } from '../../pages/api-page/constants/api-pages';
import { documentationPages } from '../../pages/documentation-page/constants/documentation-pages';
import { recipes } from '../../pages/recipes-page/pages/recipes-content';
import type { IV2SearchPage } from '../types/v2-search-page';
import { createV2SearchDocuments } from '../utils/create-v2-search-documents.util';
import { v2StaticSearchPages } from './v2-static-search-pages';

const v2ContentSearchPages: IV2SearchPage[] = [
  ...documentationPages.map((page) => ({
    path: page.path,
    title: page.title,
    summary: page.description,
    searchText: page.searchText,
  })),
  ...apiPages.map((page) => ({
    path: page.path,
    title: page.title,
    summary: page.description,
    searchText: page.searchText,
  })),
  ...recipes.map((page) => ({
    path: page.path,
    title: page.title,
    summary: page.description,
    searchText: `${page.primaryKeyword} ${page.secondaryKeywords.join(' ')} ${page.searchText}`,
  })),
];

export const v2SearchDocuments = createV2SearchDocuments(
  [...v2StaticSearchPages, ...v2ContentSearchPages],
  v2RouteManifest
);
