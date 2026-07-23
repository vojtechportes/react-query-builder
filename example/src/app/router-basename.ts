import { normalizeBasename } from '../shared/versioned-url';

export const routerBasename =
  normalizeBasename(import.meta.env.BASE_URL) || undefined;
