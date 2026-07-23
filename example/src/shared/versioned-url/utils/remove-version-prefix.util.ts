import { formatVersionedUrl } from './format-versioned-url.util';
import { parseVersionedUrl } from './parse-versioned-url.util';

export const removeVersionPrefix = (url: string, basename?: string): string => {
  const parsedUrl = parseVersionedUrl(url, basename);

  return parsedUrl.version ? formatVersionedUrl(parsedUrl, undefined) : url;
};
