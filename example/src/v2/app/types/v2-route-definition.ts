import type { V2RouteSection } from './v2-route-section';

export interface IV2RouteDefinition {
  path: string;
  title: string;
  section: V2RouteSection;
}
