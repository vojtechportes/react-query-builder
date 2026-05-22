import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@vojtechportes/react-query-builder': fileURLToPath(
        new URL('../src', import.meta.url)
      ),
    },
  },
});
