import type { IVersionedUrl } from '../types/versioned-url';
import { normalizeBasename } from './normalize-basename.util';

export const parseVersionedUrl = (
  url: string,
  basename?: string
): IVersionedUrl => {
  const hashIndex = url.indexOf('#');
  const hash = hashIndex === -1 ? '' : url.slice(hashIndex);
  const urlWithoutHash = hashIndex === -1 ? url : url.slice(0, hashIndex);
  const searchIndex = urlWithoutHash.indexOf('?');
  const search = searchIndex === -1 ? '' : urlWithoutHash.slice(searchIndex);
  const rawPathname =
    searchIndex === -1 ? urlWithoutHash : urlWithoutHash.slice(0, searchIndex);
  const absolutePathname = rawPathname.startsWith('/')
    ? rawPathname
    : `/${rawPathname}`;
  const normalizedPathname = absolutePathname || '/';
  const normalizedBasename = normalizeBasename(basename);
  const isWithinBasename =
    normalizedBasename !== '' &&
    (normalizedPathname === normalizedBasename ||
      normalizedPathname.startsWith(`${normalizedBasename}/`));
  const pathAfterBasename = isWithinBasename
    ? normalizedPathname.slice(normalizedBasename.length) || '/'
    : normalizedPathname;
  const versionMatch = pathAfterBasename.match(/^\/(v1|v2)(?=\/|$)/);
  const version = versionMatch?.[1] as IVersionedUrl['version'];
  const pathname = versionMatch
    ? pathAfterBasename.slice(versionMatch[0].length) || '/'
    : pathAfterBasename;

  return {
    basename: normalizedBasename,
    version,
    pathname,
    search,
    hash,
  };
};
