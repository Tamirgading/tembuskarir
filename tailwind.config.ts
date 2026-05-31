import type { Config } from 'tailwindcss'

// ── Skala brand "Tumbuh" (emerald) ──────────────────────────────────────────
// Dipakai sebagai brand utama, sekaligus me-remap `blue` & `indigo` lama
// supaya seluruh kelas `blue-*` / gradient biru di kodebase otomatis jadi emerald.
const emerald = {
  50:  '#ECFDF5',
  100: '#D1FAE5',
  200: '#A7F3D0',
  300: '#6EE7B7',
  400: '#34D399',
  500: '#13B981',
  600: '#0E9F6E', // ← primary brand
  700: '#0B7D57',
  800: '#0A6347',
  900: '#0B4F3A',
  950: '#04321F',
  DEFAULT: '#0E9F6E',
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
        sans: ['var(--font-hanken)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        heading: ['var(--font-bricolage)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        num: ['var(--font-space)', 'ui-monospace', 'monospace'],
      },
      colors: {
        // Token brand TembusKarir
        brand: emerald,
        // Remap warna lama → emerald (cohesive instan, hilangkan biru/ungu generik)
        blue: emerald,
        indigo: emerald,
        // Netral hangat & ink
        paper: '#F7F6F2',
        'paper-soft': '#F0EEE7',
        hairline: '#E7E4DC',
        ink: {
          DEFAULT: '#0F2C44',
          soft: '#3A4A5A',
          muted: '#5A6B7B',
        },
      },
      boxShadow: {
        soft: '0 4px 20px -2px rgba(15, 44, 68, 0.06)',
        glow: '0 0 15px rgba(14, 159, 110, 0.30)',
      },
    },
  },
  plugins: [],
}

export default config
