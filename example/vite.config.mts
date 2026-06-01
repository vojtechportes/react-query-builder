import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

const srcRoot = fileURLToPath(new URL('../src', import.meta.url));

export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: '@vojtechportes/react-query-builder/parseQuery',
        replacement: `${srcRoot}/parseQuery`,
      },
      {
        find: '@vojtechportes/react-query-builder/formatQuery',
        replacement: `${srcRoot}/formatQuery`,
      },
      {
        find: '@vojtechportes/react-query-builder/theme-provider',
        replacement: `${srcRoot}/theme-provider`,
      },
      {
        find: '@vojtechportes/react-query-builder/monaco',
        replacement: `${srcRoot}/monaco`,
      },
      {
        find: '@vojtechportes/react-query-builder/mui/v7',
        replacement: `${srcRoot}/mui/v7`,
      },
      {
        find: '@vojtechportes/react-query-builder/mui/v9',
        replacement: `${srcRoot}/mui/v9`,
      },
      {
        find: '@vojtechportes/react-query-builder/antd/v5',
        replacement: `${srcRoot}/antd/v5`,
      },
      {
        find: '@vojtechportes/react-query-builder/antd/v6',
        replacement: `${srcRoot}/antd/v6`,
      },
      {
        find: '@vojtechportes/react-query-builder/fluentui/v8',
        replacement: `${srcRoot}/fluentui/v8`,
      },
      {
        find: '@vojtechportes/react-query-builder/mantine/v8',
        replacement: `${srcRoot}/mantine/v8`,
      },
      {
        find: '@vojtechportes/react-query-builder/mantine/v9',
        replacement: `${srcRoot}/mantine/v9`,
      },
      {
        find: '@vojtechportes/react-query-builder',
        replacement: srcRoot,
      },
    ],
  },
});
