import type { V1RouteSection } from './v1-route-section';

export interface IV1RouteDefinition {
  path: string;
  title: string;
  section: V1RouteSection;
}
