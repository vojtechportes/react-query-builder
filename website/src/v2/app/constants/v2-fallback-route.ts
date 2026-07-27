import type { IV2FallbackRoute } from '../types/v2-fallback-route';
import { createV2PublicPath } from '../utils/create-v2-public-path.util';

export const v2FallbackRoute: IV2FallbackRoute = {
  path: '*',
  to: '/',
  publicTo: createV2PublicPath('/'),
};
