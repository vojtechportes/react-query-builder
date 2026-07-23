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
    build: {
      emptyOutDir: true,
      lib: {
        entry: resolve(import.meta.dirname, 'smoke/package-surface.smoke.ts'),
        formats: ['es'],
      },
      outDir: resolve(
        import.meta.dirname,
        `.smoke-dist/${binding.target}/client`
      ),
      rollupOptions: {
        external: [
          /^@ant-design\//,
          /^@emotion\//,
          /^@fluentui\//,
          /^@mantine\//,
          /^@mui\//,
          /^@radix-ui\//,
          /^antd(?:\/.*)?$/,
          /^bootstrap-icons(?:\/.*)?$/,
          /^monaco-editor(?:\/.*)?$/,
        ],
        output: { entryFileNames: 'package-surface.mjs' },
      },
    },
  };
});
