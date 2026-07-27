export const SITE_NAME = 'React Query Builder';
export const SITE_URL =
  import.meta.env.VITE_SITE_URL ||
  'https://vojtechportes.github.io/react-query-builder/';
export const SITE_IMAGE_URL = `${SITE_URL}favicon.png`;
export const GITHUB_URL =
  'https://github.com/vojtechportes/react-query-builder';
export const NPM_URL =
  'https://www.npmjs.com/package/@vojtechportes/react-query-builder';

export const TOP_LEVEL_NAV = [
  { label: 'Home', to: '/' },
  { label: 'Documentation', to: '/documentation' },
  { label: 'API', to: '/api' },
  { label: 'Demo', to: '/demo' },
  { label: 'Recipes', to: '/recipes' },
] as const;
