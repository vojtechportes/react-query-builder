import type { IV1SeoPage } from './v1-seo-page';

export interface IV1SeoConfig {
  siteName: string;
  siteUrl: string;
  siteVersion: 'v1';
  packageVersion: '1.33.1';
  versionPath: '/v1';
  robotsDirective: string;
  pages: IV1SeoPage[];
}
