import type { IRouteRedirectManifest } from '../../../shared/route-redirect';
import { v2LegacyRouteRedirects } from './v2-legacy-route-redirects';
import { v2RouteDefinitions } from './v2-route-definitions';

export const v2RouteRedirectManifest: IRouteRedirectManifest = {
  canonicalPaths: v2RouteDefinitions.map(({ path }) => path),
  redirects: v2LegacyRouteRedirects,
};
