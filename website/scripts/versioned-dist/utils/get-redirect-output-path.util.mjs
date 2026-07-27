export const getRedirectOutputPath = (distRoot, pathname) => {
  const relativePath = pathname.replace(/^\/+|\/+$/g, '');

  return relativePath
    ? `${distRoot}/${relativePath}/index.html`
    : `${distRoot}/index.html`;
};
