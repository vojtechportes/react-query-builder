import { v2RouteManifest } from '../../app/constants/v2-route-manifest';
import type { IV2NavigationItem } from '../../app/types/v2-navigation-item';
import { v2TopLevelPaths } from './v2-top-level-paths';

export const v2TopNavigation: IV2NavigationItem[] = v2TopLevelPaths.map(
  (path) => {
    const route = v2RouteManifest.find((candidate) => candidate.path === path)!;

    return {
      label: route.section,
      path: route.path,
      publicPath: route.publicPath,
    };
  }
);
