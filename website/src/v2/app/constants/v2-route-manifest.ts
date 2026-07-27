import type { IV2RouteRecord } from '../types/v2-route-record';
import { createV2Breadcrumbs } from '../utils/create-v2-breadcrumbs.util';
import { createV2PublicPath } from '../utils/create-v2-public-path.util';
import { createV2RelatedLinks } from '../utils/create-v2-related-links.util';
import { createV2SourceLink } from '../utils/create-v2-source-link.util';
import { getV2RouteSourcePath } from '../utils/get-v2-route-source-path.util';
import { v2BreadcrumbTitlesByPath } from './v2-breadcrumb-titles-by-path';
import { v2RouteDefinitions } from './v2-route-definitions';

export const v2RouteManifest: IV2RouteRecord[] = v2RouteDefinitions.map(
  ({ path, title, section }) => ({
    path,
    publicPath: createV2PublicPath(path),
    title,
    section,
    breadcrumbs: createV2Breadcrumbs(path, v2BreadcrumbTitlesByPath),
    relatedLinks: createV2RelatedLinks(path, section),
    sourceLink: createV2SourceLink(getV2RouteSourcePath(path, section)),
  })
);
