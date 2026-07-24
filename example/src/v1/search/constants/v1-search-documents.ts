import { v1RouteManifest } from '../../app/constants/v1-route-manifest';
import { apiPages } from '../../pages/api-page/constants/api-pages';
import { documentationPages } from '../../pages/documentation-page/constants/documentation-pages';
import { recipes } from '../../pages/recipes-page/pages/recipes-content';
import type { IV1SearchPage } from '../types/v1-search-page';
import { createV1SearchDocuments } from '../utils/create-v1-search-documents.util';
import { v1StaticSearchPages } from './v1-static-search-pages';

const v1ContentSearchPages: IV1SearchPage[] = [
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

export const v1SearchDocuments = createV1SearchDocuments(
  [...v1StaticSearchPages, ...v1ContentSearchPages],
  v1RouteManifest
);
