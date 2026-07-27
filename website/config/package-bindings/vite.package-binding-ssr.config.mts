import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import { v1PackageBinding } from './v1-package-binding';
import { v2PackageBinding } from './v2-package-binding';
import { createPackageIsolationPlugin } from './utils/create-package-isolation-plugin.util';

export default defineConfig(({ mode }) => {
  const binding = mode === 'v1' ? v1PackageBinding : v2PackageBinding;

  const oppositeBinding =
    binding.target === 'v1' ? v2PackageBinding : v1PackageBinding;

  return {
    plugins: [createPackageIsolationPlugin(binding, oppositeBinding)],
    resolve: {
      alias: binding.aliases,
      dedupe: ['react', 'react-dom'],
    },
    ssr: { noExternal: binding.ssrNoExternal },
    build: {
      emptyOutDir: true,
      outDir: resolve(import.meta.dirname, `.smoke-dist/${binding.target}/ssr`),
      rollupOptions: {
        input: resolve(import.meta.dirname, 'smoke/ssr-surface.smoke.tsx'),
        output: { entryFileNames: 'ssr-surface.mjs' },
      },
      ssr: true,
    },
  };
});
