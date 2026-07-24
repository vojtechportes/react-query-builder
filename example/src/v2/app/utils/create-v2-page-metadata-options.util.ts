import type { ISeoPage } from '../../../constants/seo-pages';
import type { IV2RouteRecord } from '../types/v2-route-record';

export const createV2PageMetadataOptions = (
  seoPage: ISeoPage,
  route: IV2RouteRecord
) => ({
  ...seoPage,
  path: route.publicPath,
  breadcrumbs: route.breadcrumbs.map(({ label, publicPath }) => ({
    name: label,
    path: publicPath,
  })),
});
