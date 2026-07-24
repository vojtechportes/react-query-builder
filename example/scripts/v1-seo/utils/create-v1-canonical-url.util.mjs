export const createV1CanonicalUrl = (pathname, siteUrl, versionPath) => {
  const normalizedPath =
    pathname.replace(/[?#].*$/, '').replace(/\/+$/, '') || '/';
  const publicPath =
    normalizedPath === versionPath ||
    normalizedPath.startsWith(`${versionPath}/`)
      ? normalizedPath
      : `${versionPath}${normalizedPath === '/' ? '' : normalizedPath}`;
  const normalizedSiteUrl = siteUrl.endsWith('/') ? siteUrl : `${siteUrl}/`;

  return new URL(publicPath.replace(/^\//, ''), normalizedSiteUrl).toString();
};
