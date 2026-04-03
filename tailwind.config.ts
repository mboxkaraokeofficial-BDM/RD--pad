import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          base:    '#09090F',
          card:    'rgba(255,255,255,0.05)',
          elevated:'rgba(255,255,255,0.08)',
          overlay: 'rgba(9,9,15,0.85)',
        },
        glass: {
          DEFAULT: 'rgba(255,255,255,0.06)',
          border:  'rgba(255,255,255,0.10)',
          strong:  'rgba(255,255,255,0.12)',
        },
        accent: {
          purple: '#A855F7',
          pink:   '#EC4899',
          lime:   '#A3E635',
          teal:   '#00D2CC',  // Spotify/YouTube teal for active nav
        },
        text: {
          primary:   '#FFFFFF',
          secondary: 'rgba(255,255,255,0.60)',
          muted:     'rgba(255,255,255,0.30)',
        },
        status: {
          online:  '#10B981',
          warning: '#F59E0B',
          offline: '#EF4444',
          idle:    '#6B7280',
        },
      },
      backgroundImage: {
        'glow-purple': 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(168,85,247,0.25) 0%, transparent 70%)',
        'glow-pink':   'radial-gradient(ellipse 50% 35% at 80% 100%, rgba(236,72,153,0.20) 0%, transparent 70%)',
        'glow-bottom': 'radial-gradient(ellipse 70% 40% at 30% 100%, rgba(168,85,247,0.15) 0%, transparent 70%)',
        'card-gradient':'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
        'pill-active':  'linear-gradient(135deg, #A855F7 0%, #EC4899 100%)',
      },
      boxShadow: {
        'glow-sm':  '0 0 12px rgba(168,85,247,0.35)',
        'glow-md':  '0 0 24px rgba(168,85,247,0.30)',
        'glow-pink':'0 0 20px rgba(236,72,153,0.30)',
        'card':     '0 4px 24px rgba(0,0,0,0.40)',
        'nav':      '0 -1px 30px rgba(0,0,0,0.60)',
      },
      backdropBlur: {
        nav: '20px',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans Thai', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'slide-up':   'slideUp 0.3s ease-out',
        'fade-in':    'fadeIn 0.2s ease-out',
        'press':      'press 0.1s ease-out',
      },
      keyframes: {
        pulseGlow: {
          '0%,100%': { boxShadow: '0 0 12px rgba(168,85,247,0.35)' },
          '50%':     { boxShadow: '0 0 28px rgba(168,85,247,0.60)' },
        },
        slideUp: {
          from: { transform: 'translateY(20px)', opacity: '0' },
          to:   { transform: 'translateY(0)',    opacity: '1' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        press: {
          '0%,100%': { transform: 'scale(1)' },
          '50%':     { transform: 'scale(0.94)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
