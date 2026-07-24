import { v2RouteManifest } from '../constants/v2-route-manifest';
import type { IV2RouteRecord } from '../types/v2-route-record';

export const findV2RouteRecord = (pathname: string): IV2RouteRecord => {
  const normalizedPath = pathname.replace(/\/+$/, '') || '/';

  return (
    v2RouteManifest.find((route) => route.path === normalizedPath) ??
    v2RouteManifest[0]
  );
};
