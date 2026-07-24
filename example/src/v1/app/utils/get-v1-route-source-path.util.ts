import type { V1RouteSection } from '../types/v1-route-section';

export const getV1RouteSourcePath = (
  path: string,
  section: V1RouteSection
): string => {
  if (section === 'Home') {
    return 'example/src/v1/pages/home-page/home-page.tsx';
  }

  if (section === 'Demo') {
    return 'example/src/v1/pages/demo-page/demo-page.tsx';
  }

  if (section === 'Recipes') {
    const recipeName = path.split('/').filter(Boolean)[1];

    return recipeName
      ? `example/src/v1/pages/recipes-page/pages/${recipeName}.recipe.ts`
      : 'example/src/v1/pages/recipes-page/recipes-page.tsx';
  }

  const routeName = path.split('/').filter(Boolean).slice(1).join('-');

  if (section === 'API') {
    const contentName = routeName || 'overview';

    return `example/src/v1/pages/api-page/components/${contentName}-api-content.tsx`;
  }

  const pageName = `${routeName || 'overview'}-documentation-page`;

  return `example/src/v1/pages/documentation-page/pages/${pageName}/${pageName}.tsx`;
};
