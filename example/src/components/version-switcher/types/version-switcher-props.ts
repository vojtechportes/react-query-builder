import type { SiteVersion } from '../../../shared/versioned-url';

export interface IVersionSwitcherProps {
  basename?: string;
  currentVersion: SiteVersion;
}
