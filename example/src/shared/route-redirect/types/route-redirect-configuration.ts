import type { SiteVersion } from '../../versioned-url';
import type { IRouteRedirectManifest } from './route-redirect-manifest';

export interface IRouteRedirectConfiguration {
  latestVersion: SiteVersion;
  manifests: Record<SiteVersion, IRouteRedirectManifest>;
}
