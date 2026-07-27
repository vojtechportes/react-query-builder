import type { IV2RouteRecord } from '../../app/types/v2-route-record';
import type { IV2PageMetadataOptions } from '../types/v2-page-metadata-options';
import type { IV2SeoPage } from '../types/v2-seo-page';

export const createV2PageMetadataOptions = (
  seoPage: IV2SeoPage,
  route: IV2RouteRecord
): IV2PageMetadataOptions => ({
  path: route.publicPath,
  keywords: seoPage.keywords,
  section: seoPage.section,
  breadcrumbs: route.breadcrumbs.map(({ label, publicPath }) => ({
    name: label,
    path: publicPath,
  })),
  faqs: seoPage.faqs,
});
