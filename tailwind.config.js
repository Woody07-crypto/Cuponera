/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // Habilita dark mode por clase (toggle manual)
  darkMode: 'class',
  theme: {
    extend: {
      // ── Paleta La Cuponera ──────────────────────────────────────
      colors: {
        navy:      { DEFAULT: '#0A1628', light: '#0F2040', dark: '#060E1A' },
        gold:      { DEFAULT: '#C9A84C', light: '#E2C36A', dark: '#A8873A' },
        turquoise: { DEFAULT: '#00B4D8', light: '#48CAE4', dark: '#0096B7' },
        cream:     { DEFAULT: '#F8F9FA', soft: '#EFF1F3' },
        // Aliases semánticos
        primary:   '#0A1628',
        accent:    '#C9A84C',
        highlight: '#00B4D8',
      },

      // ── Tipografía ──────────────────────────────────────────────
      fontFamily: {
        heading: ['"Playfair Display"', 'Georgia', 'serif'],
        body:    ['Inter', 'system-ui', 'sans-serif'],
      },

      // ── Sombras premium ────────────────────────────────────────
      boxShadow: {
        'glass':   '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
        'gold':    '0 4px 24px rgba(201, 168, 76, 0.25)',
        'card':    '0 2px 16px rgba(10, 22, 40, 0.4)',
        'card-hover': '0 8px 40px rgba(10, 22, 40, 0.6), 0 0 0 1px rgba(201,168,76,0.2)',
        'turquoise': '0 4px 24px rgba(0, 180, 216, 0.25)',
      },

      // ── Bordes redondeados ─────────────────────────────────────
      borderRadius: {
        'xl2': '16px',
        'xl3': '20px',
        'xl4': '24px',
      },

      // ── Animaciones personalizadas ─────────────────────────────
      keyframes: {
        'fade-in-up': {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in-right': {
          '0%':   { opacity: '0', transform: 'translateX(40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'shimmer': {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'pulse-gold': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(201,168,76,0.4)' },
          '50%':      { boxShadow: '0 0 0 8px rgba(201,168,76,0)' },
        },
        'spin-slow': {
          '0%':   { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'toast-in': {
          '0%':   { opacity: '0', transform: 'translateX(100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'toast-out': {
          '0%':   { opacity: '1', transform: 'translateX(0)' },
          '100%': { opacity: '0', transform: 'translateX(100%)' },
        },
      },
      animation: {
        'fade-in-up':    'fade-in-up 0.5s ease-out both',
        'fade-in':       'fade-in 0.4s ease-out both',
        'slide-in-right':'slide-in-right 0.4s ease-out both',
        'shimmer':       'shimmer 1.8s infinite linear',
        'pulse-gold':    'pulse-gold 2s infinite',
        'spin-slow':     'spin-slow 3s linear infinite',
        'toast-in':      'toast-in 0.35s ease-out both',
        'toast-out':     'toast-out 0.35s ease-in both',
      },

      // ── Backdrop blur ──────────────────────────────────────────
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
