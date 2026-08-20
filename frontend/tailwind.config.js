/** @type {import('tailwindcss').Config} */
// NOTE: This project uses Tailwind CSS v4.
// In Tailwind v4, custom color tokens are defined in CSS via @theme {} blocks in index.css.
// This config file is largely vestigial — only darkMode strategy is relevant here.
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
}
