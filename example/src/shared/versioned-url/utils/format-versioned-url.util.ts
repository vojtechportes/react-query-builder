import type { SiteVersion } from '../types/site-version';
import type { IVersionedUrl } from '../types/versioned-url';

export const formatVersionedUrl = (
  parsedUrl: IVersionedUrl,
  version: SiteVersion | undefined
): string => {
  const versionPrefix = version ? `/${version}` : '';
  const pathname = parsedUrl.pathname === '/' ? '' : parsedUrl.pathname;
  const versionedPathname =
    `${parsedUrl.basename}${versionPrefix}${pathname}` || '/';

  return `${versionedPathname}${parsedUrl.search}${parsedUrl.hash}`;
};
