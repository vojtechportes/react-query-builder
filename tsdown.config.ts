import { defineConfig } from 'tsdown';

export default defineConfig({
  clean: true,
  dts: true,
  entry: {
    index: 'src/index.tsx',
    parseQuery: 'src/parseQuery/index.ts',
    formatQuery: 'src/formatQuery/index.ts',
    'antd/v5/index': 'src/antd/v5/index.ts',
    'antd/v6/index': 'src/antd/v6/index.ts',
    'mui/v7/index': 'src/mui/v7/index.ts',
    'mui/v9/index': 'src/mui/v9/index.ts',
  },
  format: ['esm', 'cjs'],
  sourcemap: true,
});
