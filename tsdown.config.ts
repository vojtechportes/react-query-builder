import { defineConfig } from 'tsdown';

export default defineConfig({
  clean: true,
  dts: true,
  entry: {
    index: 'src/index.tsx',
    parseQuery: 'src/parseQuery/index.ts',
    formatQuery: 'src/formatQuery/index.ts',
    'mui/v7/index': 'src/mui/v7/index.ts',
    'mui/v9/index': 'src/mui/v9/index.ts',
  },
  format: ['esm', 'cjs'],
  sourcemap: true,
});
