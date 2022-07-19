import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['react-is', 'prop-types', 'react-fast-compare', 'warning', 'react-dom', 'classnames'],
  },
  base: './',
  test: {
    globals: true,
    environment: 'happy-dom',
    deps: {
      inline: ['@ugrc', '@esri', '@arcgis'],
    },
  },
});
