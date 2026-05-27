/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#F97316',
          hover: '#FB923C',
          light: '#FBBF24',
        },
        surface: {
          DEFAULT: '#09090B',
          card: '#18181B',
          border: '#27272A',
          hover: '#27272A80',
          elevated: '#212125',
        },
        success: '#10b981',
        warning: '#f59e0b',
        info: '#06b6d4',
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-out',
        slideDown: 'slideDown 0.3s ease-out',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        shimmer: 'shimmer 2s infinite',
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
        shimmer: {
          '0%, 100%': { backgroundPosition: '200% center' },
          '50%': { backgroundPosition: '-200% center' },
        },
      },
      boxShadow: {
        glow: '0 0 20px rgba(249, 115, 22, 0.3)',
        'glow-sm': '0 0 10px rgba(249, 115, 22, 0.15)',
      },
    },
  },
  plugins: [],
};
