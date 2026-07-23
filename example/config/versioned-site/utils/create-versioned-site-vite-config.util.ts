import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import type { UserConfig } from 'vite';
import { v1PackageBinding } from '../../package-bindings/v1-package-binding';
import { v2PackageBinding } from '../../package-bindings/v2-package-binding';
import { createPackageIsolationPlugin } from '../../package-bindings/utils/create-package-isolation-plugin.util';
import { createGoogleTagManagerPlugin } from '../../../vite-plugins/create-google-tag-manager-plugin';
import type { VersionBuildKind } from '../types/version-build-kind';
import type { VersionTarget } from '../types/version-target';
import { createImportBoundaryPlugin } from './create-import-boundary-plugin.util';
import { createVersionEntryPlugin } from './create-version-entry-plugin.util';

export const createVersionedSiteViteConfig = (
  target: VersionTarget,
  buildKind: VersionBuildKind
): UserConfig => {
  const exampleRoot = resolve(import.meta.dirname, '../../..');
  const binding = target === 'v1' ? v1PackageBinding : v2PackageBinding;
  const oppositeBinding = target === 'v1' ? v2PackageBinding : v1PackageBinding;
  const stagingRoot = resolve(exampleRoot, '.versioned-dist', target);
  const isSsr = buildKind === 'ssr';

  return {
    base: process.env.VITE_BASE_PATH || '/',
    plugins: [
      react(),
      createGoogleTagManagerPlugin(process.env.VITE_SITE_URL),
      ...(!isSsr ? [createVersionEntryPlugin(target)] : []),
      createImportBoundaryPlugin(target),
      createPackageIsolationPlugin(binding, oppositeBinding),
    ],
    resolve: {
      alias: binding.aliases,
      dedupe: ['react', 'react-dom'],
    },
    ssr: {
      noExternal: binding.ssrNoExternal,
    },
    build: {
      copyPublicDir: !isSsr,
      emptyOutDir: true,
      outDir: isSsr ? resolve(stagingRoot, '.ssg') : stagingRoot,
      rollupOptions: isSsr
        ? {
            input: resolve(exampleRoot, 'src', target, 'entry-server.tsx'),
            output: {
              entryFileNames: 'entry-server.mjs',
            },
          }
        : undefined,
      ssr: isSsr,
    },
  };
};
