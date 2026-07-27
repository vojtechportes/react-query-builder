import { normalizeBasename } from '../shared/versioned-url';

export const routerBasename =
  normalizeBasename(import.meta.env.VITE_BASE_PATH) || undefined;
