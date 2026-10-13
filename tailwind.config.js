/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#16a34a',
          50: '#f0fdf4',
          100: '#dcfce7',
          400: '#4ade80',
          500: '#16a34a',
          600: '#15803d',
          700: '#166534',
        },
        background: '#ffffff',
        'background-dark': '#000000',
        element: '#f1f5f9',
        'element-dark': '#212225',
        selected: '#e2e8f0',
        'selected-dark': '#2E3135',
        content: '#0f172a',
        'content-dark': '#ffffff',
        muted: '#64748b',
        'muted-dark': '#B0B4BA',
        border: '#e2e8f0',
        link: '#15803d',
        success: '#16a34a',
        danger: '#dc2626',
      },
    },
  },
  plugins: [],
};
