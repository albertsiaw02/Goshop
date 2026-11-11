/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
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
        background: 'rgb(var(--color-background) / <alpha-value>)',
        element: 'rgb(var(--color-element) / <alpha-value>)',
        selected: 'rgb(var(--color-selected) / <alpha-value>)',
        content: 'rgb(var(--color-content) / <alpha-value>)',
        muted: 'rgb(var(--color-muted) / <alpha-value>)',
        border: 'rgb(var(--color-border) / <alpha-value>)',
        'brand-soft': 'rgb(var(--color-brand-soft) / <alpha-value>)',
        'brand-ink': 'rgb(var(--color-brand-ink) / <alpha-value>)',
        'danger-soft': 'rgb(var(--color-danger-soft) / <alpha-value>)',
        placeholder: 'rgb(var(--color-placeholder) / <alpha-value>)',
        link: 'rgb(var(--color-brand-ink) / <alpha-value>)',
        success: '#16a34a',
        danger: '#dc2626',
      },
    },
  },
  plugins: [],
};
