import seoPages from './seo-pages.json';

export interface ISeoPage {
  path: string;
  title: string;
  description: string;
  keywords: string;
  section: string;
}

export interface ISeoPagesConfig {
  siteName: string;
  siteUrl: string;
  pages: ISeoPage[];
}

export const seoPagesConfig = seoPages as ISeoPagesConfig;

export const seoPagesByPath = new Map(
  seoPagesConfig.pages.map(page => [page.path, page])
);

export const canonicalSeoPages = seoPagesConfig.pages;

export const normalizeSeoPath = (pathname: string) => {
  const normalizedPath = pathname.replace(/\/+$|\?.*$/g, '') || '/';
  return normalizedPath === '' ? '/' : normalizedPath;
};

export const findSeoPage = (pathname: string) =>
  seoPagesByPath.get(normalizeSeoPath(pathname)) ?? seoPagesByPath.get('/')!;
