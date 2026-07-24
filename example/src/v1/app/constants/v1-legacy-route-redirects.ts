import type { IV1RouteRedirect } from '../types/v1-route-redirect';
import { createV1PublicPath } from '../utils/create-v1-public-path.util';

export const v1LegacyRouteRedirects: IV1RouteRedirect[] = [
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
  publicFrom: createV1PublicPath(from),
  to,
  publicTo: createV1PublicPath(to),
}));
