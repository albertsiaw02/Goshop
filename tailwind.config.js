/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#22c55e',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
        },
        background: '#ffffff',
        'background-dark': '#000000',
        element: '#F0F0F3',
        'element-dark': '#212225',
        selected: '#E0E1E6',
        'selected-dark': '#2E3135',
        content: '#000000',
        'content-dark': '#ffffff',
        muted: '#60646C',
        'muted-dark': '#B0B4BA',
        link: '#16a34a',
        success: '#2E9E5B',
        danger: '#D64545',
      },
    },
  },
  plugins: [],
};
