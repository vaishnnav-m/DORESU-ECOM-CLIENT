/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        volkhov: ['Volkhov', 'serif'],
        digital:['digital','sans-serif']
      },
    },
  },
  plugins: [],
}

