/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'warm-cream': '#FBF9F5',
        'forest': {
          DEFAULT: '#1E3A2B',
          dark: '#14271D',
          light: '#2A4E3B',
          soft: '#EAF1ED',
        },
        'sage': {
          DEFAULT: '#2D5A43',
          light: '#E8F0EC',
          muted: '#88A795',
        },
        'terracotta': {
          DEFAULT: '#E07A5F',
          dark: '#C65E44',
          light: '#FBF0EC',
        },
        'amber-gold': '#D97706',
        'stone-black': '#1C1917',
        'stone-muted': '#78716C',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'soft': '0 8px 30px rgba(30, 58, 43, 0.06)',
        'elevated': '0 20px 40px -15px rgba(30, 58, 43, 0.12)',
        'glow': '0 0 25px rgba(45, 90, 67, 0.25)',
        'cart': '0 12px 36px rgba(20, 39, 29, 0.28)',
      },
    },
  },
  plugins: [],
}
