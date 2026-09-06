import type { Config } from 'tailwindcss'

const navyBlue = {
  50: '#f0f9ff',
  100: '#e0f2fe',
  200: '#9be1fd',
  300: '#7dd3fc',
  400: '#389add',
  500: '#0284c7',
  600: '#16487e',
  700: '#103762',
  800: '#075985',
  900: '#0c4a6e',
  950: '#082f49',
  DEFAULT: '#16487E',
  dark: '#103762',
  hover: '#123863',
  accent: '#389ADD',
  light: '#9BE1FD',
  tint: '#F0F7FF',
}

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        heading: ['"Plus Jakarta Sans"', 'sans-serif'],
        num: ['"Plus Jakarta Sans"', 'monospace'],
      },
      colors: {
        brand: navyBlue,
        paper: '#F8FAFC',
        'paper-soft': '#F1F5F9',
        hairline: '#E2E8F0',
        ink: {
          DEFAULT: '#0F172A',
          soft: '#334155',
          muted: '#64748B',
        },
      },
      boxShadow: {
        soft: '0 4px 20px -2px rgba(15, 44, 68, 0.06)',
        glow: '0 0 15px rgba(22, 72, 126, 0.30)',
        modal: '0 25px 50px -12px rgba(22, 72, 126, 0.22), 0 0 0 1px rgba(226, 232, 240, 0.8)',
        'brand-glow': '0 10px 25px -5px rgba(22, 72, 126, 0.35)',
      },
      keyframes: {
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-9px) rotate(0.5deg)' },
        },
        'float-reverse': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(8px) rotate(-0.5deg)' },
        },
        'pulse-slow': {
          '0%, 100%': { transform: 'scale(1) translate(0, 0)', opacity: '0.45' },
          '50%': { transform: 'scale(1.12) translate(15px, -20px)', opacity: '0.7' },
        },
        'pulse-reverse': {
          '0%, 100%': { transform: 'scale(1) translate(0, 0)', opacity: '0.4' },
          '50%': { transform: 'scale(1.18) translate(-25px, 15px)', opacity: '0.65' },
        },
        'pulse-center': {
          '0%, 100%': { transform: 'scale(0.95)', opacity: '0.3' },
          '50%': { transform: 'scale(1.08)', opacity: '0.55' },
        },
        'stream-flow': {
          '0%': { transform: 'translateY(100%) translateX(0)', opacity: '0' },
          '20%': { opacity: '0.7' },
          '80%': { opacity: '0.7' },
          '100%': { transform: 'translateY(-120%) translateX(20px)', opacity: '0' },
        },
      },
      animation: {
        'float-1': 'float-slow 5s ease-in-out infinite',
        'float-2': 'float-reverse 6s ease-in-out infinite 0.5s',
        'float-3': 'float-slow 7s ease-in-out infinite 1s',
        'float-4': 'float-reverse 5.5s ease-in-out infinite 1.5s',
        'orb-1': 'pulse-slow 9s ease-in-out infinite',
        'orb-2': 'pulse-reverse 11s ease-in-out infinite',
        'orb-3': 'pulse-center 8s ease-in-out infinite 1s',
        'stream-1': 'stream-flow 8s cubic-bezier(0.4, 0, 0.2, 1) infinite',
        'stream-2': 'stream-flow 11s cubic-bezier(0.4, 0, 0.2, 1) infinite 2.5s',
        'stream-3': 'stream-flow 9.5s cubic-bezier(0.4, 0, 0.2, 1) infinite 5s',
        'stream-4': 'stream-flow 12s cubic-bezier(0.4, 0, 0.2, 1) infinite 1.2s',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries')
  ],
}

export default config
