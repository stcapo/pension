/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#4299e1',
          DEFAULT: '#3182ce',
          dark: '#2b6cb0',
        },
        secondary: {
          light: '#9ae6b4',
          DEFAULT: '#68d391',
          dark: '#48bb78',
        },
        background: '#f7fafc',
        sidebarBg: '#f0f5fa',
        headerBg: '#ffffff',
      },
    },
  },
  plugins: [],
}