export const normalizeV1SeoPath = (pathname: string): string =>
  pathname.replace(/[?#].*$/, '').replace(/\/+$/, '') || '/';
