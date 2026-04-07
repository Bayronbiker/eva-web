/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        eva: "#2E7D32", // El verde de tu App Android
      }
    },
  },
  plugins: [],
}