import { defineConfig } from 'vitest/config';
import { v1PackageBinding } from './v1-package-binding';
import { v2PackageBinding } from './v2-package-binding';

export default defineConfig(({ mode }) => {
  const binding = mode === 'v1' ? v1PackageBinding : v2PackageBinding;

  return {
    resolve: {
      alias: binding.aliases,
      dedupe: ['react', 'react-dom'],
    },
    ssr: { noExternal: binding.ssrNoExternal },
    test: {
      environment: 'node',
      include: [
        'config/package-bindings/package-bindings.test.ts',
        'config/package-bindings/smoke/*.smoke.test.ts',
      ],
    },
  };
});
