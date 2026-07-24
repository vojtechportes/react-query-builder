import { v1SeoConfig } from '../constants/v1-seo-config';

export const getV1SiteUrl = (): string =>
  import.meta.env.VITE_SITE_URL || v1SeoConfig.siteUrl;
