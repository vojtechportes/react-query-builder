import type { IRouteRedirect } from './route-redirect';

export interface IRouteRedirectManifest {
  canonicalPaths: readonly string[];
  redirects: readonly IRouteRedirect[];
}
