import type { IV1Breadcrumb } from './v1-breadcrumb';
import type { IV1RelatedLink } from './v1-related-link';
import type { V1RouteSection } from './v1-route-section';
import type { IV1SourceLink } from './v1-source-link';

export interface IV1RouteRecord {
  path: string;
  publicPath: string;
  title: string;
  section: V1RouteSection;
  breadcrumbs: IV1Breadcrumb[];
  relatedLinks: IV1RelatedLink[];
  sourceLink: IV1SourceLink;
}
