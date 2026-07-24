import type { ISeoPage } from '../../../constants/seo-pages';
import type { IV1RouteRecord } from '../types/v1-route-record';

export const createV1PageMetadataOptions = (
  seoPage: ISeoPage,
  route: IV1RouteRecord
) => ({
  ...seoPage,
  path: route.publicPath,
  breadcrumbs: route.breadcrumbs.map(({ label, publicPath }) => ({
    name: label,
    path: publicPath,
  })),
});
