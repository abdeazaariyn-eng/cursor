import type { Config } from 'tailwindcss'

const COLORS = {
  primary: '#B97863',
  primaryDark: '#A3674F',
  primaryLight: '#C9917F',
  blush: '#F7EDE8',
  ivory: '#FFF9F5',
  brown: '#7B5E57',
  deep: '#2F2523',
  gold: '#D9A441',
  sage: '#6F9E8E',
  error: '#B42318',
  success: '#267A4A',
}

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Direct palette (used by pre-existing components)
        primary: {
          DEFAULT: COLORS.primary,
          dark: COLORS.primaryDark,
          light: COLORS.primaryLight,
        },
        blush: COLORS.blush,
        ivory: COLORS.ivory,
        brown: {
          DEFAULT: COLORS.brown,
          deep: COLORS.deep,
        },
        gold: COLORS.gold,
        sage: COLORS.sage,
        border: '#E7D4CC',
        error: COLORS.error,
        success: COLORS.success,
        // Brand namespace aliases (used by new components)
        brand: {
          primary: COLORS.primary,
          'primary-dark': COLORS.primaryDark,
          'primary-light': COLORS.primaryLight,
          blush: COLORS.blush,
          ivory: COLORS.ivory,
          brown: COLORS.brown,
          deep: COLORS.deep,
          gold: COLORS.gold,
          sage: COLORS.sage,
          error: COLORS.error,
          success: COLORS.success,
        },
      },
      fontFamily: {
        arabic: ['var(--font-arabic)', 'IBM Plex Sans Arabic', 'Noto Kufi Arabic', 'sans-serif'],
        sans: ['var(--font-arabic)', 'IBM Plex Sans Arabic', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        card: '0 2px 20px rgba(185, 120, 99, 0.08)',
        'card-hover': '0 8px 32px rgba(185, 120, 99, 0.15)',
        drawer: '-4px 0 40px rgba(47, 37, 35, 0.15)',
      },
      animation: {
        'slide-in-left': 'slideInLeft 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'fade-in': 'fadeIn 0.2s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        countdown: 'countdown linear forwards',
      },
      keyframes: {
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        countdown: {
          '0%': { strokeDashoffset: '0' },
          '100%': { strokeDashoffset: '283' },
        },
      },
    },
  },
  plugins: [],
}

export default config
