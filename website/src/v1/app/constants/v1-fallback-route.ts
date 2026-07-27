import type { IV1FallbackRoute } from '../types/v1-fallback-route';
import { createV1PublicPath } from '../utils/create-v1-public-path.util';

export const v1FallbackRoute: IV1FallbackRoute = {
  path: '*',
  to: '/',
  publicTo: createV1PublicPath('/'),
};
