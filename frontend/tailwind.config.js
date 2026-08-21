/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#070c18',
          900: '#0b1329',
          850: '#0e1726',
          800: '#101935',
          750: '#152247',
          700: '#1c2d5a',
        },
        neon: {
          blue: '#3b82f6',
          emerald: '#10b981',
          purple: '#a855f7',
          cyan: '#06b6d4',
          amber: '#f59e0b',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'neon-blue': '0 0 15px -3px rgba(59, 130, 246, 0.4), inset 0 0 10px -3px rgba(59, 130, 246, 0.2)',
        'neon-emerald': '0 0 15px -3px rgba(16, 185, 129, 0.4), inset 0 0 10px -3px rgba(16, 185, 129, 0.2)',
        'neon-purple': '0 0 15px -3px rgba(168, 85, 247, 0.4), inset 0 0 10px -3px rgba(168, 85, 247, 0.2)',
        'neon-cyan': '0 0 15px -3px rgba(6, 182, 212, 0.4), inset 0 0 10px -3px rgba(6, 182, 212, 0.2)',
        'neon-amber': '0 0 15px -3px rgba(245, 158, 11, 0.4), inset 0 0 10px -3px rgba(245, 158, 11, 0.2)',
        'card-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      }
    },
  },
  plugins: [],
}
