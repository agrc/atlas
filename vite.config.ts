import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import loadVersion from 'vite-plugin-package-version';
import { defineConfig } from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: {
    include: ['firebase/analytics', 'firebase/app', 'firebase/performance'],
  },
  plugins: [tailwindcss(), react(), loadVersion()],
  resolve: {
    alias: [
      {
        find: 'use-sync-external-store/shim/index.js',
        replacement: 'react',
      },
    ],
    // this is only applicable when pnpm-linking the utah-design-package
    // dedupe: ['firebase', '@arcgis/core', '@arcgis/lumina', '@arcgis/map-components', 'react', 'react-dom'],
  },
  test: {
    environment: 'happy-dom',
  },
});
