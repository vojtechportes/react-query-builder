import type { IV2SeoPage } from './v2-seo-page';

export interface IV2SeoConfig {
  siteName: string;
  siteUrl: string;
  siteVersion: 'v2';
  packageVersion: '1.33.1';
  versionPath: '/v2';
  robotsDirective: string;
  pages: IV2SeoPage[];
}
