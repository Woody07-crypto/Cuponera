/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          purple:  '#7C3AED',
          violet:  '#6D28D9',
          cyan:    '#06B6D4',
          amber:   '#F59E0B',
          pink:    '#EC4899',
          dark:    '#07090F',
          surface: '#0E1117',
          card:    '#131720',
          border:  'rgba(255,255,255,0.07)',
        },
      },
      fontFamily: {
        heading: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body:    ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'glow-purple': '0 0 30px rgba(124,58,237,0.35), 0 0 60px rgba(124,58,237,0.12)',
        'glow-cyan':   '0 0 30px rgba(6,182,212,0.35), 0 0 60px rgba(6,182,212,0.12)',
        'glow-amber':  '0 0 24px rgba(245,158,11,0.4)',
        'card':        '0 1px 0 rgba(255,255,255,0.05), 0 4px 24px rgba(0,0,0,0.4)',
        'card-hover':  '0 0 0 1px rgba(124,58,237,0.4), 0 8px 40px rgba(0,0,0,0.5)',
        'glass':       '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)',
        'input':       '0 0 0 3px rgba(124,58,237,0.15)',
        'input-valid': '0 0 0 3px rgba(16,185,129,0.15)',
        'input-error': '0 0 0 3px rgba(239,68,68,0.15)',
      },
      backgroundImage: {
        'gradient-brand':    'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)',
        'gradient-brand-r':  'linear-gradient(135deg, #06B6D4 0%, #7C3AED 100%)',
        'gradient-amber':    'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
        'gradient-dark':     'linear-gradient(160deg, #0E1117 0%, #07090F 100%)',
        'gradient-card':     'linear-gradient(160deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
        'gradient-mesh':     'radial-gradient(ellipse at top left, rgba(124,58,237,0.15) 0%, transparent 60%), radial-gradient(ellipse at bottom right, rgba(6,182,212,0.1) 0%, transparent 60%)',
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '20px',
        '4xl': '28px',
      },
      keyframes: {
        'fade-in-up': {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'shimmer': {
          '0%':   { backgroundPosition: '-400% 0' },
          '100%': { backgroundPosition: '400% 0' },
        },
        'glow-pulse': {
          '0%,100%': { opacity: '0.6' },
          '50%':     { opacity: '1' },
        },
        'float': {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%':     { transform: 'translateY(-8px)' },
        },
        'toast-in': {
          '0%':   { opacity: '0', transform: 'translateX(100%) scale(0.9)' },
          '100%': { opacity: '1', transform: 'translateX(0) scale(1)' },
        },
        'toast-out': {
          '0%':   { opacity: '1', transform: 'translateX(0) scale(1)' },
          '100%': { opacity: '0', transform: 'translateX(100%) scale(0.9)' },
        },
        'border-flow': {
          '0%,100%': { backgroundPosition: '0% 50%' },
          '50%':     { backgroundPosition: '100% 50%' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.55s cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-in':    'fade-in 0.4s ease both',
        'shimmer':    'shimmer 2s infinite linear',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'float':      'float 4s ease-in-out infinite',
        'toast-in':   'toast-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) both',
        'toast-out':  'toast-out 0.3s ease-in both',
        'spin-slow':  'spin 3s linear infinite',
        'border-flow':'border-flow 3s ease infinite',
      },
    },
  },
  plugins: [],
}
