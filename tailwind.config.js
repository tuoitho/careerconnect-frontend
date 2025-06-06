/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f7f7f7',
          100: '#e3e3e3',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#333333',
          600: '#1a1a1a',
          700: '#000000',
          800: '#075985',
          900: '#0c4a6e',
        }
      },
      animation: {
        'tiktok-bounce-left': 'tiktok-bounce-left 1s infinite cubic-bezier(0.455, 0.03, 0.515, 0.955)',
        'tiktok-bounce-right': 'tiktok-bounce-right 1s infinite cubic-bezier(0.455, 0.03, 0.515, 0.955)',
      },
      keyframes: {
        'tiktok-bounce-left': {
          '0%': { transform: 'translateX(-24px) scale(1)' },
          '25%': { transform: 'translateX(0) scale(1.15)' },
          '50%': { transform: 'translateX(24px) scale(1)' },
          '75%': { transform: 'translateX(0) scale(0.85)' },
          '100%': { transform: 'translateX(-24px) scale(1)' },
        },
        'tiktok-bounce-right': {
          '0%': { transform: 'translateX(24px) scale(1)' },
          '25%': { transform: 'translateX(0) scale(0.85)' },
          '50%': { transform: 'translateX(-24px) scale(1)' },
          '75%': { transform: 'translateX(0) scale(1.15)' },
          '100%': { transform: 'translateX(24px) scale(1)' },
        },
      },
    },
  },
  plugins: [],
};