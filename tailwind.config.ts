import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#0b0f13',
          surface: '#0f1621',
          card: '#111826',
          accent: '#7dd3fc',
          accent2: '#a5b4fc',
          muted: '#94a3b8',
          ok: '#34d399',
          warn: '#fbbf24',
          err: '#f87171'
        }
      },
      borderRadius: {
        xl: '0.75rem',
        '2xl': '1rem'
      },
      boxShadow: {
        'brand-sm': '0 6px 18px rgba(12, 17, 23, 0.35)',
        'brand-md': '0 16px 40px rgba(12, 17, 23, 0.45)',
        'brand-glow': '0 0 30px rgba(125, 211, 252, 0.3)'
      },
      fontFamily: {
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif'
        ]
      }
    }
  },
  plugins: []
};

export default config;
