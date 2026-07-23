import type { SiteVersion } from '../types/site-version';
import { formatVersionedUrl } from './format-versioned-url.util';
import { parseVersionedUrl } from './parse-versioned-url.util';

export const addVersionPrefix = (
  url: string,
  version: SiteVersion,
  basename?: string
): string => {
  const parsedUrl = parseVersionedUrl(url, basename);

  return parsedUrl.version ? url : formatVersionedUrl(parsedUrl, version);
};
