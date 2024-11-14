import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import loadVersion from 'vite-plugin-package-version';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), loadVersion()],
  resolve: {
    // this is only applicable when npm-linking the utah-design-package
    dedupe: ['firebase', '@arcgis/core'],
  },
});
