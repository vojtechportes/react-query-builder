import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import { v2PackageBinding } from './config/package-bindings/v2-package-binding';
import { createGoogleTagManagerPlugin } from './vite-plugins/create-google-tag-manager-plugin';

const websiteMantineCoreRoot = fileURLToPath(
  new URL('./node_modules/@mantine/core', import.meta.url)
);

const websiteMantineHooksRoot = fileURLToPath(
  new URL('./node_modules/@mantine/hooks', import.meta.url)
);

export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [react(), createGoogleTagManagerPlugin(process.env.VITE_SITE_URL)],
  test: {
    alias: v2PackageBinding.aliases,
  },
  ssr: {
    noExternal: v2PackageBinding.ssrNoExternal,
  },
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: [
      ...v2PackageBinding.aliases,
      {
        find: '@mantine/core',
        replacement: websiteMantineCoreRoot,
      },
      {
        find: '@mantine/hooks',
        replacement: websiteMantineHooksRoot,
      },
    ],
  },
});
