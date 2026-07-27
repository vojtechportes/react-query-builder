export const normalizeV2SeoPath = (pathname: string): string =>
  pathname.replace(/[?#].*$/, '').replace(/\/+$/, '') || '/';
