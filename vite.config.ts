import react from '@vitejs/plugin-react';
import loadVersion from 'vite-plugin-package-version';
import { defineConfig } from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), loadVersion()],
  resolve: {
    // this is only applicable when pnpm-linking the utah-design-package
    // dedupe: ['firebase', '@arcgis/core', '@arcgis/lumina', '@arcgis/map-components', 'react', 'react-dom'],
  },
  test: {
    environment: 'happy-dom',
  },
});
