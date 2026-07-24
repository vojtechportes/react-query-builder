import { relatedRecipesByPath as apiRelatedRecipesByPath } from '../../pages/api-page/constants/related-recipes-by-path';
import { documentationPages } from '../../pages/documentation-page/constants/documentation-pages';
import { relatedRecipesByPath as documentationRelatedRecipesByPath } from '../../pages/documentation-page/constants/related-recipes-by-path';
import { recipes } from '../../pages/recipes-page/pages/recipes-content';
import type { IV1RelatedLink } from '../types/v1-related-link';
import type { V1RouteSection } from '../types/v1-route-section';
import { createV1PublicPath } from './create-v1-public-path.util';

export const createV1RelatedLinks = (
  path: string,
  section: V1RouteSection
): IV1RelatedLink[] => {
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
      publicPath: createV1PublicPath(link.path),
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
      publicPath: createV1PublicPath(relatedPath),
      external: false,
    })),
    ...recipe.relatedRecipePaths.map((relatedPath) => ({
      label:
        recipes.find((candidate) => candidate.path === relatedPath)?.title ??
        relatedPath,
      path: relatedPath,
      publicPath: createV1PublicPath(relatedPath),
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
