/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['"Comic Neue"', 'cursive', 'sans-serif'],
      },
      colors: {
        'cream': '#f5ecc8',
        'brown': '#654321',
        'light-brown': '#8B4513',
        'border-brown': '#d4c19c',
      }
    },
  },
  plugins: [],
} 