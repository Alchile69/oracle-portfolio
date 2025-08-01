/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // 🎨 Couleurs Oracle Portfolio
      colors: {
        // Couleurs principales
        'primary-dark': '#0f0f23',      // Noir profond - arrière-plan principal
        'secondary-dark': '#1a1a2e',    // Bleu nuit - arrière-plan secondaire
        'electric-blue': '#00d4ff',     // Bleu électrique - accents, liens, boutons
        'white-pure': '#ffffff',        // Blanc pur - texte principal
        
        // Couleurs de texte
        'text': {
          'primary': '#ffffff',
          'secondary': '#9ca3af',
          'muted': '#6b7280',
        },
        
        // Couleurs d'arrière-plan
        'background': {
          'primary': '#0f0f23',
          'secondary': '#1a1a2e',
          'card': '#1a1a2e',
          'dark': '#0f0f23',
        },
        
        // Couleurs d'état
        'success': '#10b981',
        'warning': '#f59e0b',
        'error': '#ef4444',
        'info': '#3b82f6',
        
        // Couleurs de bordure
        'border': {
          'primary': 'rgba(255, 255, 255, 0.1)',
          'secondary': 'rgba(255, 255, 255, 0.05)',
          'electric': 'rgba(0, 212, 255, 0.3)',
        },
        
        // Couleurs grises
        'gray': {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
      },
      
      // 📝 Typographie
      fontFamily: {
        'sans': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        'mono': ['JetBrains Mono', 'Monaco', 'Cascadia Code', 'Segoe UI Mono', 'monospace'],
      },
      
      fontSize: {
        'xs': ['12px', { lineHeight: '16px' }],
        'sm': ['14px', { lineHeight: '20px' }],
        'base': ['16px', { lineHeight: '24px' }],
        'lg': ['18px', { lineHeight: '28px' }],
        'xl': ['20px', { lineHeight: '28px' }],
        '2xl': ['24px', { lineHeight: '32px' }],
        '3xl': ['30px', { lineHeight: '36px' }],
        '4xl': ['36px', { lineHeight: '40px' }],
        '5xl': ['48px', { lineHeight: '1' }],
        '6xl': ['60px', { lineHeight: '1' }],
      },
      
      // 🎨 Gradients
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #00d4ff, #0099cc)',
        'gradient-secondary': 'linear-gradient(135deg, #1a1a2e, #0f0f23)',
        'gradient-electric': 'linear-gradient(135deg, #00d4ff, #33e0ff)',
        'gradient-dark': 'linear-gradient(135deg, #0f0f23, #1a1a2e)',
      },
      
      // 🌟 Ombres
      boxShadow: {
        'card': '0 4px 20px rgba(0, 0, 0, 0.3)',
        'card-hover': '0 8px 30px rgba(0, 0, 0, 0.4)',
        'electric': '0 4px 12px rgba(0, 212, 255, 0.3)',
        'electric-hover': '0 6px 20px rgba(0, 212, 255, 0.4)',
        'inner-light': 'inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      },
      
      // 🎭 Animations
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      
      // 📐 Espacements
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      
      // 🎯 Border radius
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
      
      // 🎨 Backdrop blur
      backdropBlur: {
        'xs': '2px',
      },
      
      // 📱 Breakpoints personnalisés
      screens: {
        'xs': '475px',
        '3xl': '1600px',
      },
    },
  },
  plugins: [
    // Plugin pour les utilitaires personnalisés
    function({ addUtilities }) {
      const newUtilities = {
        '.text-gradient': {
          'background': 'linear-gradient(135deg, #00d4ff, #33e0ff)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
        },
        '.glass': {
          'background': 'rgba(26, 26, 46, 0.8)',
          'backdrop-filter': 'blur(10px)',
          'border': '1px solid rgba(255, 255, 255, 0.1)',
        },
        '.card-hover': {
          'transition': 'all 0.3s ease',
          '&:hover': {
            'transform': 'translateY(-2px)',
            'box-shadow': '0 8px 30px rgba(0, 0, 0, 0.4)',
            'border-color': 'rgba(0, 212, 255, 0.3)',
          },
        },
        '.btn-electric': {
          'background': 'linear-gradient(135deg, #00d4ff, #0099cc)',
          'color': '#ffffff',
          'box-shadow': '0 4px 12px rgba(0, 212, 255, 0.3)',
          'transition': 'all 0.2s ease',
          '&:hover': {
            'background': 'linear-gradient(135deg, #33e0ff, #00b8e6)',
            'box-shadow': '0 6px 20px rgba(0, 212, 255, 0.4)',
            'transform': 'translateY(-2px)',
          },
        },
      }
      addUtilities(newUtilities)
    }
  ],
}

