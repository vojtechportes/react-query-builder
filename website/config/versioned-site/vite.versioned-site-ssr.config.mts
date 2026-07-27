import { defineConfig } from 'vite';
import { createVersionedSiteViteConfig } from './utils/create-versioned-site-vite-config.util';
import { resolveVersionTarget } from './utils/resolve-version-target.util';

export default defineConfig(({ mode }) =>
  createVersionedSiteViteConfig(resolveVersionTarget(mode), 'ssr')
);
