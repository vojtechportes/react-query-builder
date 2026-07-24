import type { SiteVersion } from '../../../shared/versioned-url';
import { v1VersionSwitchRoutes } from '../../../v1/app/constants/v1-version-switch-routes';
import { v2VersionSwitchRoutes } from '../../../v2/app/constants/v2-version-switch-routes';

export const getVersionSwitchRoutes = (
  version: SiteVersion
): readonly string[] =>
  version === 'v1' ? v1VersionSwitchRoutes : v2VersionSwitchRoutes;
