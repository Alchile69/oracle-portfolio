/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Oracle Portfolio Brand Colors
        primary: {
          50: '#e6f7ff',
          100: '#bae7ff',
          200: '#91d5ff',
          300: '#69c0ff',
          400: '#40a9ff',
          500: '#00d4ff', // Primary brand color
          600: '#00b7e6',
          700: '#0099cc',
          800: '#007bb3',
          900: '#005c99',
        },
        background: {
          primary: '#0f0f23',
          secondary: '#1a1a2e',
          tertiary: '#2a2a3e',
        },
        text: {
          primary: '#ffffff',
          secondary: '#a0a0a0',
          muted: '#4a4a5e',
        },
        success: '#00ff88',
        error: '#ff4757',
        warning: '#ffa502',
        // Regime Colors
        regime: {
          expansion: '#00ff88',
          recovery: '#40a9ff',
          stagflation: '#ffa502',
          recession: '#ff4757',
        },
        // Sector Colors
        sector: {
          technology: '#00d4ff',
          healthcare: '#00ff88',
          finance: '#ffa502',
          energy: '#ff6b6b',
          consumer: '#4ecdc4',
          industrials: '#45b7d1',
          materials: '#96ceb4',
          utilities: '#feca57',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'oracle': '0 4px 20px rgba(0, 212, 255, 0.15)',
        'oracle-lg': '0 8px 40px rgba(0, 212, 255, 0.2)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

