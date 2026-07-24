import { v1RouteManifest } from '../constants/v1-route-manifest';
import type { IV1RouteRecord } from '../types/v1-route-record';

export const findV1RouteRecord = (pathname: string): IV1RouteRecord => {
  const normalizedPath = pathname.replace(/\/+$/, '') || '/';

  return (
    v1RouteManifest.find((route) => route.path === normalizedPath) ??
    v1RouteManifest[0]
  );
};
