import { v1RouteManifest } from '../../app/constants/v1-route-manifest';
import type { IV1NavigationItem } from '../../app/types/v1-navigation-item';
import { v1TopLevelPaths } from './v1-top-level-paths';

export const v1TopNavigation: IV1NavigationItem[] = v1TopLevelPaths.map(
  (path) => {
    const route = v1RouteManifest.find((candidate) => candidate.path === path)!;

    return {
      label: route.section,
      path: route.path,
      publicPath: route.publicPath,
    };
  }
);
