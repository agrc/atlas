import ugrcPreset from '@ugrc/tailwind-preset';
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./node_modules/@ugrc/**/*.{tsx,jsx,js}', './index.html', './src/**/*.{tsx,jsx,js}'],
  presets: [ugrcPreset],
  theme: {
    extend: {
      fontFamily: {
        heading: ['SourceSansPro-Black', 'Source Sans Pro', 'Arial', 'Helvetica', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
