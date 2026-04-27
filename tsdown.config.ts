import { defineConfig } from 'tsdown';

export default defineConfig({
  clean: true,
  dts: true,
  entry: ['src/index.tsx'],
  format: ['esm', 'cjs'],
  sourcemap: true,
});
