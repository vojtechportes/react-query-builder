import type { IV2Breadcrumb } from './v2-breadcrumb';
import type { IV2RelatedLink } from './v2-related-link';
import type { V2RouteSection } from './v2-route-section';
import type { IV2SourceLink } from './v2-source-link';

export interface IV2RouteRecord {
  path: string;
  publicPath: string;
  title: string;
  section: V2RouteSection;
  breadcrumbs: IV2Breadcrumb[];
  relatedLinks: IV2RelatedLink[];
  sourceLink: IV2SourceLink;
}
