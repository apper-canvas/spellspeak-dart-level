/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6B5FF6',
        secondary: '#FFB84D',
        accent: '#4ECDC4',
        surface: '#F8F9FF',
        success: '#4EE17B',
        warning: '#FFB84D',
        error: '#FF6B6B',
        info: '#54C7FC',
        surface: {
          50: '#f8f9ff',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a'
        }
      },
      fontFamily: {
        display: ['Fredoka One', 'cursive'],
        sans: ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui'],
        heading: ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui']
      },
      animation: {
        'bounce-in': 'bounceIn 0.6s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'confetti': 'confetti 0.8s ease-out',
        'star-fill': 'starFill 0.5s ease-out forwards'
      }
    },
  },
  plugins: [],
}