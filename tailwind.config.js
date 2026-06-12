/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        wood: {
          50:  '#fdf6ec',
          100: '#f7e4c4',
          200: '#efc88a',
          300: '#e5a84d',
          400: '#c8823c',   // accent principal OliWood
          500: '#a8621e',
          600: '#8a4a10',
          700: '#6b3509',
          800: '#4d2205',
          900: '#2e1202',
        },
        dark: {
          900: '#0a0804',
          800: '#14100a',
          700: '#1e1610',
          600: '#2a1e14',
        },
        cream: {
          DEFAULT: '#f0e8d8',
          muted: 'rgba(240,232,216,0.65)',
          faint: 'rgba(240,232,216,0.35)',
        },
      },
      fontFamily: {
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
        body:    ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'hero-overlay': 'linear-gradient(to bottom, rgba(10,8,4,0.25) 0%, rgba(10,8,4,0.10) 40%, rgba(10,8,4,0.60) 100%)',
      },
      animation: {
        'logo-emerge':  'logoEmerge 1.4s cubic-bezier(0.16,1,0.3,1) 0.4s forwards',
        'reveal-up':    'revealUp 1.1s cubic-bezier(0.22,1,0.36,1) 0.6s forwards',
        'rule-grow':    'ruleGrow 0.6s ease-out 1.5s forwards',
        'sub-fade':     'subFade 0.8s ease-out 1.7s forwards',
        'scroll-drop':  'scrollDrop 1.8s ease-in-out 2.8s infinite',
        'fade-in-up':   'fadeInUp 0.7s ease-out forwards',
      },
      keyframes: {
        logoEmerge: {
          '0%':   { opacity: '0', transform: 'scale(0.78) translateY(30px)', filter: 'blur(8px)' },
          '30%':  { opacity: '0.15', filter: 'blur(4px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)', filter: 'blur(0)' },
        },
        revealUp: {
          '0%':   { clipPath: 'inset(100% 0 0% 0)' },
          '100%': { clipPath: 'inset(0% 0 0% 0)' },
        },
        ruleGrow: {
          '0%':   { transform: 'scaleX(0)', opacity: '0' },
          '100%': { transform: 'scaleX(1)', opacity: '1' },
        },
        subFade: {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scrollDrop: {
          '0%':   { top: '-100%' },
          '100%': { top: '200%' },
        },
        fadeInUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
