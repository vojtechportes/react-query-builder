import type { V2RouteSection } from '../types/v2-route-section';

export const getV2RouteSourcePath = (
  path: string,
  section: V2RouteSection
): string => {
  if (section === 'Home') {
    return 'example/src/v2/pages/home-page/home-page.tsx';
  }

  if (section === 'Demo') {
    return 'example/src/v2/pages/demo-page/demo-page.tsx';
  }

  if (section === 'Recipes') {
    const recipeName = path.split('/').filter(Boolean)[1];

    return recipeName
      ? `example/src/v2/pages/recipes-page/pages/${recipeName}.recipe.ts`
      : 'example/src/v2/pages/recipes-page/recipes-page.tsx';
  }

  const routeName = path.split('/').filter(Boolean).slice(1).join('-');

  if (section === 'API') {
    const contentName = routeName || 'overview';

    return `example/src/v2/pages/api-page/components/${contentName}-api-content.tsx`;
  }

  const pageName = `${routeName || 'overview'}-documentation-page`;

  return `example/src/v2/pages/documentation-page/pages/${pageName}/${pageName}.tsx`;
};
