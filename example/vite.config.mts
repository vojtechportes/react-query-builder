import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@vojtechportes/react-query-builder': fileURLToPath(
        new URL('../src/index.tsx', import.meta.url)
      ),
    },
  },
});
