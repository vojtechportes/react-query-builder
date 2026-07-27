import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';
import { v1PackageBinding } from '../package-bindings/v1-package-binding';
import { v2PackageBinding } from '../package-bindings/v2-package-binding';
import { createImportBoundaryPlugin } from './utils/create-import-boundary-plugin.util';
import { resolveVersionTarget } from './utils/resolve-version-target.util';

export default defineConfig(({ mode }) => {
  const target = resolveVersionTarget(mode);
  const binding = target === 'v1' ? v1PackageBinding : v2PackageBinding;
  const oppositeTarget = target === 'v1' ? 'v2' : 'v1';

  return {
    plugins: [createImportBoundaryPlugin(target)],
    resolve: {
      alias: [
        {
          find: 'styled-components',
          replacement: resolve(
            import.meta.dirname,
            '../../../node_modules/styled-components/dist/styled-components.esm.js'
          ),
        },
        ...binding.aliases,
      ],
      dedupe: ['react', 'react-dom'],
    },
    ssr: {
      noExternal: binding.ssrNoExternal,
    },
    test: {
      server: {
        deps: {
          inline: [
            ...binding.ssrNoExternal,
            ...(target === 'v1' ? [/[\\/]rqb-v1[\\/]/] : []),
          ],
        },
      },
      exclude: ['**/node_modules/**', '**/dist/**', `src/${oppositeTarget}/**`],
      include: [
        'config/versioned-site/**/*.test.ts',
        'src/**/*.test.ts',
        'src/**/*.test.tsx',
      ],
    },
  };
});
