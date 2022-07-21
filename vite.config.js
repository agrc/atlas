import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  test: {
    globals: true,
    environment: 'happy-dom',
    deps: {
      inline: ['@ugrc', '@arcgis/core'],
    },
  },
});
