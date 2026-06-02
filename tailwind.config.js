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
      boxShadow: {
        'green-glow':
          '0 10px 30px -8px rgba(39, 208, 105, 0.45), 0 4px 14px rgba(39, 208, 105, 0.25)',
        // Soft card elevation used across product surfaces — mirrors the
        // main Artemis frontend so the admin shares the same depth language.
        card: '0 8px 30px rgba(0, 0, 0, 0.04)',
      },
      maxWidth: {
        shell: '1200px',
      },
    },
  },
  plugins: [],
};
