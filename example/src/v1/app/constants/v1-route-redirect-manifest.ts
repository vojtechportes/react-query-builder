import type { IRouteRedirectManifest } from '../../../shared/route-redirect';
import { v1LegacyRouteRedirects } from './v1-legacy-route-redirects';
import { v1RouteDefinitions } from './v1-route-definitions';

export const v1RouteRedirectManifest: IRouteRedirectManifest = {
  canonicalPaths: v1RouteDefinitions.map(({ path }) => path),
  redirects: v1LegacyRouteRedirects,
};
