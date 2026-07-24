import type { IRouteRedirectConfiguration } from '../types/route-redirect-configuration';
import type { IResolveRouteRequestOptions } from '../types/resolve-route-request-options';
import type { RouteRequestResolution } from '../types/route-request-resolution';
import { formatVersionedUrl } from '../../versioned-url/utils/format-versioned-url.util';
import { normalizeBasename } from '../../versioned-url/utils/normalize-basename.util';
import { parseVersionedUrl } from '../../versioned-url/utils/parse-versioned-url.util';
import { permanentRedirectStatus } from '../constants/permanent-redirect-status';

export const resolveRouteRequest = (
  configuration: IRouteRedirectConfiguration,
  { basename, url }: IResolveRouteRequestOptions
): RouteRequestResolution => {
  const normalizedBasename = normalizeBasename(basename);
  const pathname = url.split(/[?#]/, 1)[0] || '/';
  const absolutePathname = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const isWithinBasename =
    normalizedBasename === '' ||
    absolutePathname === normalizedBasename ||
    absolutePathname.startsWith(`${normalizedBasename}/`);

  if (!isWithinBasename) {
    return { status: 404 };
  }

  const parsedUrl = parseVersionedUrl(url, basename);
  const targetVersion = parsedUrl.version ?? configuration.latestVersion;
  const manifest = configuration.manifests[targetVersion];

  if (manifest.canonicalPaths.includes(parsedUrl.pathname)) {
    if (parsedUrl.version) {
      return { status: 200 };
    }

    return {
      status: permanentRedirectStatus,
      location: formatVersionedUrl(parsedUrl, targetVersion),
    };
  }

  const redirect = manifest.redirects.find(
    ({ from }) => from === parsedUrl.pathname
  );

  if (!redirect) {
    return { status: 404 };
  }

  return {
    status: permanentRedirectStatus,
    location: formatVersionedUrl(
      { ...parsedUrl, pathname: redirect.to },
      targetVersion
    ),
  };
};
