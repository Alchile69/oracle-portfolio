/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Oracle Portfolio Brand Colors
        'oracle': {
          primary: '#00d4ff',      // Bleu électrique
          secondary: '#1a1a2e',    // Bleu nuit
          dark: '#0f0f23',         // Noir profond
          border: '#2a2a3e',       // Gris foncé
          text: {
            primary: '#ffffff',    // Blanc pur
            secondary: '#4a4a5e'   // Gris moyen
          },
          success: '#00ff88',      // Vert succès
          error: '#ff4757',        // Rouge alerte
          warning: '#ffa502'       // Orange warning
        },
        // Background colors
        background: {
          dark: '#0f0f23',         // Noir profond
          card: '#1a1a2e',         // Bleu nuit
          cardHover: '#2a2a3e'     // Gris foncé
        },
        // Primary colors (Oracle blue)
        primary: {
          50: '#E6FFFA',
          100: '#B2F5EA',
          200: '#81E6D9',
          300: '#4FD1C5',
          400: '#38B2AC',
          500: '#00d4ff',          // Oracle blue
          600: '#0099cc',
          700: '#007799',
          800: '#005566',
          900: '#003333'
        },
        // Secondary colors
        secondary: {
          50: '#FFF5F5',
          100: '#FFE3E3',
          200: '#FFC9C9',
          300: '#FFA8A8',
          400: '#FF8787',
          500: '#ff4757',          // Rouge Oracle
          600: '#FA5252',
          700: '#F03E3E',
          800: '#E03131',
          900: '#C92A2A'
        },
        // Success colors
        success: {
          500: '#00ff88',          // Vert Oracle
          600: '#00cc6a',
          700: '#00994c'
        },
        // Warning colors
        warning: {
          500: '#ffa502',          // Orange Oracle
          600: '#cc8400',
          700: '#996300'
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif']
      },
      spacing: {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem'
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      },
      boxShadow: {
        'oracle': '0 4px 20px rgba(0, 212, 255, 0.2)',
        'oracle-hover': '0 8px 30px rgba(0, 212, 255, 0.3)'
      }
    },
  },
  plugins: [],
}