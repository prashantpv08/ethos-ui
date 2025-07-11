const defaultTheme = require('tailwindcss/defaultTheme');
const { join } = require('path');

module.exports = {
  content: [
    join(__dirname, 'index.html'),
    join(__dirname, './src/**/*.{js,ts,jsx,tsx}'),
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Public Sans', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};
