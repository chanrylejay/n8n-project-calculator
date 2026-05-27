/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        accent: '#FF6D5A',
        dark: {
          DEFAULT: '#0D0D0D',
          50: '#141414',
          100: '#1a1a1a',
          200: '#2a2a2a',
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-out',
        slideDown: 'slideDown 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', maxHeight: '0', marginTop: '0' },
          '100%': { opacity: '1', maxHeight: '200px', marginTop: '0.75rem' },
        },
      },
    },
  },
  plugins: [],
};
