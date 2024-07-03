/** @type {import('tailwindcss').Config} */
export default {
  content: ['./node_modules/@ugrc/**/*.{jsx,js}', './index.html', './src/**/*.{jsx,js}'],
  presets: [require('@ugrc/tailwind-colors')],
  theme: {
    extend: {
      fontFamily: {
        heading: ['SourceSansPro-Black', 'Source Sans Pro', 'Arial', 'Helvetica', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
