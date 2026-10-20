/** @type {import('tailwindcss').Config} */
// Vibe Board design tokens — from DESIGN.md
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: { primary: '#2F5D50', accent: '#E9A23B' },
        surface: { page: '#FAF7F2', card: '#FFFDF9' },
        text: { primary: '#2B2A27', muted: '#7A746A' }, // text-text-primary / text-text-muted
        border: { subtle: '#E7E1D6' }, // border-border-subtle
        // type-feature-text is a touch darker so the label stays readable on tinted cards (M8)
        type: { feature: { DEFAULT: '#4C7A9B', text: '#446E8C' }, bug: '#8E4A7A' },
        // M8 due-date colours (FR16):
        // DEFAULT = border / icon, bg = soft badge background, text = badge text, card = card tint
        due: {
          safe: { DEFAULT: '#5E9C6A', bg: '#E3E9DE', text: '#44704C', card: '#EFF3EB' }, // more than 2 days: green
          soon: { DEFAULT: '#E3B23C', bg: '#F7EDD7', text: '#7F6422', card: '#FBF1DB' }, // 24 hours to 2 days: yellow
          warning: { DEFAULT: '#C0392B', bg: '#F1DAD4', text: '#B13428', card: '#F9E9E4' }, // less than 24 hours: red
          overdue: { DEFAULT: '#3D6FB0', bg: '#DEE3E8', text: '#37649E', card: '#ECEFF2' }, // past due: blue
          neutral: { DEFAULT: '#A8A29E', bg: '#EEEAE5', text: '#6C6865' }, // done: no tint
        },
      },
      fontFamily: {
        heading: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}
