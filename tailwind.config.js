/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // ✅ Only declared once and followed by a comma
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
