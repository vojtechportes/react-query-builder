import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import { createGoogleTagManagerPlugin } from './vite-plugins/create-google-tag-manager-plugin';

const srcRoot = fileURLToPath(new URL('../src', import.meta.url));
const testReactRoot = fileURLToPath(
  new URL('../node_modules/react', import.meta.url)
);
const testReactDomRoot = fileURLToPath(
  new URL('../node_modules/react-dom', import.meta.url)
);
const exampleMantineCoreRoot = fileURLToPath(
  new URL('./node_modules/@mantine/core', import.meta.url)
);
const exampleMantineHooksRoot = fileURLToPath(
  new URL('./node_modules/@mantine/hooks', import.meta.url)
);

export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [react(), createGoogleTagManagerPlugin(process.env.VITE_SITE_URL)],
  test: {
    alias: {
      react: testReactRoot,
      'react-dom': testReactDomRoot,
    },
  },
  resolve: {
    alias: [
      {
        find: '@vojtechportes/react-query-builder/locale/en-US',
        replacement: srcRoot + '/locales/en-us',
      },
      {
        find: '@vojtechportes/react-query-builder/locale/fr-FR',
        replacement: srcRoot + '/locales/fr-fr',
      },
      {
        find: '@vojtechportes/react-query-builder/locale/it-IT',
        replacement: srcRoot + '/locales/it-it',
      },
      {
        find: '@vojtechportes/react-query-builder/locale/de-DE',
        replacement: srcRoot + '/locales/de-de',
      },
      {
        find: '@vojtechportes/react-query-builder/locale/es-ES',
        replacement: srcRoot + '/locales/es-es',
      },
      {
        find: '@vojtechportes/react-query-builder/locale/pt-PT',
        replacement: srcRoot + '/locales/pt-pt',
      },
      {
        find: '@vojtechportes/react-query-builder/locale/cs-CZ',
        replacement: srcRoot + '/locales/cs-cz',
      },
      {
        find: '@vojtechportes/react-query-builder/locale/sk-SK',
        replacement: srcRoot + '/locales/sk-sk',
      },
      {
        find: '@vojtechportes/react-query-builder/locale/zh-CN',
        replacement: srcRoot + '/locales/zh-cn',
      },
      {
        find: '@vojtechportes/react-query-builder/locale/zh-TW',
        replacement: srcRoot + '/locales/zh-tw',
      },
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
        find: '@vojtechportes/react-query-builder/bootstrap/v5',
        replacement: `${srcRoot}/bootstrap/v5`,
      },
      {
        find: '@vojtechportes/react-query-builder/fluentui/v8',
        replacement: `${srcRoot}/fluentui/v8`,
      },
      {
        find: '@mantine/core',
        replacement: exampleMantineCoreRoot,
      },
      {
        find: '@mantine/hooks',
        replacement: exampleMantineHooksRoot,
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
