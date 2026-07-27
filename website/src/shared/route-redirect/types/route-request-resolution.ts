export type RouteRequestResolution =
  | { status: 200 }
  | { status: 308; location: string }
  | { status: 404 };
