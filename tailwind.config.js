/* eslint-disable */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './index.html'],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB',      // azul principal
        secondary: '#5A9EFF',    // azul claro
        deep: '#102B46',         // azul-marinho profundo
        success: '#4CAF50',      // verde discreto (situções resolvidas)
        neutral: '#F5F5F5',
        gray: {
          light: '#E5E5E5',
          DEFAULT: '#B0B0B0',
          dark: '#6B6B6B',
        },
      },
      borderRadius: {
        md: '0.5rem',
      },
      boxShadow: {
        subtle: '0 1px 3px rgba(0,0,0,0.1)',
      },
    },
  },
  plugins: [],
};
