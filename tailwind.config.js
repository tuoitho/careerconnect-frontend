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
      }
    },
  },
  plugins: [],
}