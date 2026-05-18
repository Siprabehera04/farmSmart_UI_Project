/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'farm-green': '#064e3b',
        'harvest-gold': '#f59e0b',
      },
    },
  },
  plugins: [],
}