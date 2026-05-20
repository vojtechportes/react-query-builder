import { defineConfig } from 'tsdown';

export default defineConfig({
  clean: true,
  dts: true,
  entry: {
    index: 'src/index.tsx',
    parseQuery: 'src/parseQuery/index.ts',
    formatQuery: 'src/formatQuery/index.ts',
  },
  format: ['esm', 'cjs'],
  sourcemap: true,
});
