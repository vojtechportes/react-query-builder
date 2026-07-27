import type { IV2RouteRedirect } from '../types/v2-route-redirect';
import { createV2PublicPath } from '../utils/create-v2-public-path.util';

export const v2LegacyRouteRedirects: IV2RouteRedirect[] = [
  { from: '/api/builder-props', to: '/api/builder' },
  {
    from: '/documentation/parsing-and-formatting/sql',
    to: '/documentation/parsing-and-formatting/supported-formats',
  },
  {
    from: '/documentation/parsing-and-formatting/mongo',
    to: '/documentation/parsing-and-formatting/supported-formats',
  },
  {
    from: '/documentation/parsing-and-formatting/other-formats',
    to: '/documentation/parsing-and-formatting/supported-formats',
  },
  { from: '/documentation/configuration/fields', to: '/api/fields' },
  { from: '/documentation/configuration/data', to: '/api/data' },
  {
    from: '/documentation/configuration/builder-props',
    to: '/api/builder',
  },
  {
    from: '/documentation/configuration/components',
    to: '/documentation/components',
  },
].map(({ from, to }) => ({
  from,
  publicFrom: createV2PublicPath(from),
  to,
  publicTo: createV2PublicPath(to),
}));
