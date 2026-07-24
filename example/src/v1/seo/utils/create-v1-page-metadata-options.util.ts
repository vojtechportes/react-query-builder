import type { IV1RouteRecord } from '../../app/types/v1-route-record';
import type { IV1PageMetadataOptions } from '../types/v1-page-metadata-options';
import type { IV1SeoPage } from '../types/v1-seo-page';

export const createV1PageMetadataOptions = (
  seoPage: IV1SeoPage,
  route: IV1RouteRecord
): IV1PageMetadataOptions => ({
  path: route.publicPath,
  keywords: seoPage.keywords,
  section: seoPage.section,
  breadcrumbs: route.breadcrumbs.map(({ label, publicPath }) => ({
    name: label,
    path: publicPath,
  })),
  faqs: seoPage.faqs,
});
