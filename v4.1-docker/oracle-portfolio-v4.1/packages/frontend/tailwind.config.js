/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Couleurs principales Oracle Portfolio
        primary: {
          DEFAULT: '#00d4ff', // Bleu électrique
          50: '#e6f9ff',
          100: '#ccf3ff',
          200: '#99e7ff',
          300: '#66dbff',
          400: '#33cfff',
          500: '#00d4ff',
          600: '#00aacc',
          700: '#008099',
          800: '#005566',
          900: '#002b33',
        },
        // Arrière-plans
        background: {
          DEFAULT: '#0f0f23', // Noir profond
          secondary: '#1a1a2e', // Bleu nuit
          card: '#1a1a2e',
        },
        // Bordures et séparateurs
        border: {
          DEFAULT: '#2a2a3e', // Gris foncé
          light: '#4a4a5e', // Gris moyen
        },
        // Texte
        text: {
          primary: '#ffffff', // Blanc pur
          secondary: '#4a4a5e', // Gris moyen
          muted: '#6b7280',
        },
        // États
        success: '#00ff88', // Vert succès
        error: '#ff4757', // Rouge alerte
        warning: '#ffa502', // Orange warning
        // Régimes économiques
        regime: {
          expansion: '#00ff88',
          recovery: '#00d4ff',
          stagflation: '#ffa502',
          recession: '#ff4757',
        },
        // Secteurs
        sector: {
          technology: '#00d4ff',
          energy: '#ffa502',
          finance: '#00ff88',
          consumer: '#ff4757',
          healthcare: '#9c88ff',
          utilities: '#6b7280',
          materials: '#ff6b6b',
          industrials: '#00d4ff',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      fontSize: {
        'xs': ['12px', { lineHeight: '16px' }],
        'sm': ['14px', { lineHeight: '20px' }],
        'base': ['16px', { lineHeight: '24px' }],
        'lg': ['18px', { lineHeight: '28px' }],
        'xl': ['20px', { lineHeight: '28px' }],
        '2xl': ['24px', { lineHeight: '32px' }],
        '3xl': ['32px', { lineHeight: '36px' }],
        '4xl': ['36px', { lineHeight: '40px' }],
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
      spacing: {
        'xs': '4px',
        's': '8px',
        'm': '16px',
        'l': '24px',
        'xl': '32px',
        'xxl': '48px',
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
      },
      boxShadow: {
        'card': '0 4px 20px rgba(0, 0, 0, 0.3)',
        'card-hover': '0 8px 30px rgba(0, 0, 0, 0.4)',
        'primary': '0 4px 15px rgba(0, 212, 255, 0.2)',
        'primary-hover': '0 8px 25px rgba(0, 212, 255, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'loading': 'loading 1.5s infinite',
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
        loading: {
          '0%': { left: '-100%' },
          '100%': { left: '100%' },
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #00d4ff 0%, #0099cc 100%)',
        'gradient-background': 'linear-gradient(180deg, #0f0f23 0%, #1a1a2e 100%)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}; 