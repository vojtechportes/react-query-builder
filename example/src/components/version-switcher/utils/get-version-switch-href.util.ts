import {
  addVersionPrefix,
  type SiteVersion,
} from '../../../shared/versioned-url';

interface IGetVersionSwitchHrefOptions {
  basename?: string;
  hash: string;
  pathname: string;
  search: string;
  targetRoutes: readonly string[];
  targetVersion: SiteVersion;
}

export const getVersionSwitchHref = ({
  basename,
  hash,
  pathname,
  search,
  targetRoutes,
  targetVersion,
}: IGetVersionSwitchHrefOptions): string => {
  const normalizedPath = pathname.replace(/\/+$/, '') || '/';

  if (targetRoutes.includes(normalizedPath)) {
    return addVersionPrefix(
      `${normalizedPath}${search}${hash}`,
      targetVersion,
      basename
    );
  }

  let fallbackPath = normalizedPath;

  while (fallbackPath !== '/') {
    const parentSeparatorIndex = fallbackPath.lastIndexOf('/');
    fallbackPath =
      parentSeparatorIndex <= 0
        ? '/'
        : fallbackPath.slice(0, parentSeparatorIndex);

    if (targetRoutes.includes(fallbackPath)) {
      return addVersionPrefix(fallbackPath, targetVersion, basename);
    }
  }

  return addVersionPrefix('/', targetVersion, basename);
};
