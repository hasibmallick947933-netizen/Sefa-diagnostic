/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        primary: {
          50:  '#eff8ff',
          100: '#daf0ff',
          200: '#b3e3ff',
          300: '#76cfff',
          400: '#32b9ff',
          500: '#069ef0',
          600: '#007cce',
          700: '#0062a7',
          800: '#035488',
          900: '#094771',
          950: '#062d4c',
        },
        teal: {
          50:  '#f0fdfc',
          100: '#ccfbf7',
          200: '#99f6ef',
          300: '#5eeae3',
          400: '#2cd4cf',
          500: '#13b8b5',
          600: '#0d9391',
          700: '#0f7574',
          800: '#115d5d',
          900: '#134d4d',
        },
        emerald: {
          50:  '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        neutral: {
          50:  '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'slide-in-right': 'slideInRight 0.5s ease-out forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        slideInRight: { '0%': { opacity: '0', transform: 'translateX(20px)' }, '100%': { opacity: '1', transform: 'translateX(0)' } },
        float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
      },
      boxShadow: {
        'card': '0 4px 24px -4px rgba(6, 158, 240, 0.12)',
        'card-hover': '0 12px 40px -4px rgba(6, 158, 240, 0.2)',
        'glow': '0 0 30px rgba(6, 158, 240, 0.3)',
      }
    },
  },
  plugins: [],
}
