import { relatedRecipesByPath as apiRelatedRecipesByPath } from '../../pages/api-page/constants/related-recipes-by-path';
import { documentationPages } from '../../pages/documentation-page/constants/documentation-pages';
import { relatedRecipesByPath as documentationRelatedRecipesByPath } from '../../pages/documentation-page/constants/related-recipes-by-path';
import { recipes } from '../../pages/recipes-page/pages/recipes-content';
import type { IV2RelatedLink } from '../types/v2-related-link';
import type { V2RouteSection } from '../types/v2-route-section';
import { createV2PublicPath } from './create-v2-public-path.util';

export const createV2RelatedLinks = (
  path: string,
  section: V2RouteSection
): IV2RelatedLink[] => {
  const pageLinks =
    section === 'Documentation'
      ? documentationRelatedRecipesByPath[path]
      : section === 'API'
        ? apiRelatedRecipesByPath[path]
        : undefined;

  if (pageLinks) {
    return pageLinks.map((link) => ({
      label: link.label,
      path: link.path,
      publicPath: createV2PublicPath(link.path),
      external: false,
    }));
  }

  if (section !== 'Recipes' || path === '/recipes') {
    return [];
  }

  const recipe = recipes.find((candidate) => candidate.path === path);

  if (!recipe) {
    return [];
  }

  const internalLinks = [
    ...recipe.relatedDocPaths.map((relatedPath) => ({
      label:
        documentationPages.find((page) => page.path === relatedPath)?.title ??
        relatedPath,
      path: relatedPath,
      publicPath: createV2PublicPath(relatedPath),
      external: false,
    })),
    ...recipe.relatedRecipePaths.map((relatedPath) => ({
      label:
        recipes.find((candidate) => candidate.path === relatedPath)?.title ??
        relatedPath,
      path: relatedPath,
      publicPath: createV2PublicPath(relatedPath),
      external: false,
    })),
  ];
  const externalLinks = (recipe.externalReferences ?? []).map((reference) => ({
    label: reference.label,
    path: reference.href,
    external: true,
  }));

  return [...internalLinks, ...externalLinks];
};
