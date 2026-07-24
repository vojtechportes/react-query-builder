import type { IV1RouteRecord } from '../types/v1-route-record';
import { createV1Breadcrumbs } from '../utils/create-v1-breadcrumbs.util';
import { createV1PublicPath } from '../utils/create-v1-public-path.util';
import { createV1RelatedLinks } from '../utils/create-v1-related-links.util';
import { createV1SourceLink } from '../utils/create-v1-source-link.util';
import { getV1RouteSourcePath } from '../utils/get-v1-route-source-path.util';
import { v1BreadcrumbTitlesByPath } from './v1-breadcrumb-titles-by-path';
import { v1RouteDefinitions } from './v1-route-definitions';

export const v1RouteManifest: IV1RouteRecord[] = v1RouteDefinitions.map(
  ({ path, title, section }) => ({
    path,
    publicPath: createV1PublicPath(path),
    title,
    section,
    breadcrumbs: createV1Breadcrumbs(path, v1BreadcrumbTitlesByPath),
    relatedLinks: createV1RelatedLinks(path, section),
    sourceLink: createV1SourceLink(getV1RouteSourcePath(path, section)),
  })
);
