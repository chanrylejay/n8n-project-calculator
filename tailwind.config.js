/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Portfolio-inspired warm palette
        accent: {
          DEFAULT: '#d97757',
          secondary: '#e59373',
          light: '#f0a383',
          glow: 'rgba(217, 119, 87, 0.12)',
          subtle: 'rgba(217, 119, 87, 0.06)',
        },
        surface: {
          primary: '#141413',
          secondary: '#1c1b1a',
          card: '#232220',
          'card-hover': '#2b2a27',
          border: '#2d2c2a',
          'border-hover': '#3e3d3a',
        },
        text: {
          primary: '#faf9f5',
          secondary: '#c5c4be',
          muted: '#9e9d97',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
        serif: ['Lora', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'SF Mono', 'monospace'],
      },
      animation: {
        fadeIn: 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        slideDown: 'slideDown 0.3s ease-out',
        shimmer: 'shimmer 1.5s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', maxHeight: '0', marginTop: '0' },
          '100%': { opacity: '1', maxHeight: '200px', marginTop: '0.75rem' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },
      boxShadow: {
        glow: '0 0 20px rgba(217, 119, 87, 0.25)',
      },
    },
  },
  plugins: [],
};
