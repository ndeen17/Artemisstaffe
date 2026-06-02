/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          green: '#22c55e',
          greenInk: '#15803d',
          greenSoft: '#dcfce7',
          greenWash: '#f0fdf4',
          navy: '#0F172A',
          slate: '#64748B',
          border: '#E2E8F0',
        },
        ink: {
          DEFAULT: '#111827',
          muted: '#6B7280',
          subtle: '#9CA3AF',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          muted: '#FAFAFA',
        },
      },
    },
  },
  plugins: [],
};
