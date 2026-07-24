import { v2SeoConfig } from '../constants/v2-seo-config';

export const getV2SiteUrl = (): string =>
  import.meta.env.VITE_SITE_URL || v2SeoConfig.siteUrl;
