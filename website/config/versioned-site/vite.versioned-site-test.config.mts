import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';
import { v1PackageBinding } from '../package-bindings/v1-package-binding';
import { v2PackageBinding } from '../package-bindings/v2-package-binding';
import { createImportBoundaryPlugin } from './utils/create-import-boundary-plugin.util';
import { resolveVersionTarget } from './utils/resolve-version-target.util';

const require = createRequire(import.meta.url);
const prismReactRendererRuntime = require.resolve('prism-react-renderer');

export default defineConfig(({ mode }) => {
  const target = resolveVersionTarget(mode);
  const binding = target === 'v1' ? v1PackageBinding : v2PackageBinding;
  const oppositeTarget = target === 'v1' ? 'v2' : 'v1';
  const repositoryRoot = resolve(import.meta.dirname, '../../..');
  const testRuntimeAliases = [
    {
      find: /^versioned-test-prism-react-renderer-runtime$/,
      replacement: prismReactRendererRuntime,
    },
    {
      find: /^@mui\/material$/,
      replacement: resolve(
        import.meta.dirname,
        './test-doubles/mui-material.test-double.tsx'
      ),
    },
    {
      find: /^prism-react-renderer$/,
      replacement: resolve(
        import.meta.dirname,
        './test-doubles/prism-react-renderer.test-double.tsx'
      ),
    },
    {
      find: /^@testing-library\/react$/,
      replacement: resolve(
        import.meta.dirname,
        './test-doubles/react-19-testing-library.test-double.ts'
      ),
    },
    {
      find: 'react-dom',
      replacement: binding.reactDomRoot,
    },
    {
      find: 'react',
      replacement: binding.reactRoot,
    },
    {
      find: '@mantine/core',
      replacement: resolve(repositoryRoot, 'node_modules/@mantine/core'),
    },
    {
      find: '@mantine/hooks',
      replacement: resolve(repositoryRoot, 'node_modules/@mantine/hooks'),
    },
  ];

  return {
    plugins: [createImportBoundaryPlugin(target)],
    resolve: {
      alias: [
        ...testRuntimeAliases,
        {
          find: 'styled-components',
          replacement: resolve(
            import.meta.dirname,
            '../../../node_modules/styled-components/dist/styled-components.esm.js'
          ),
        },
        ...binding.aliases.filter(
          ({ find }) =>
            find !== 'react-dom' &&
            find !== 'react' &&
            find !== '@mantine/core' &&
            find !== '@mantine/hooks'
        ),
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
