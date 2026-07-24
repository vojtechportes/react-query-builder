import type { SiteVersion } from './site-version';

export interface IVersionedUrl {
  basename: string;
  version: SiteVersion | undefined;
  pathname: string;
  search: string;
  hash: string;
}
