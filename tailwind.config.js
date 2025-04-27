/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neugray': '#e0e0e0',
        'neugray-dark': '#bebebe',
        'neugray-light': '#ffffff',
      },
      boxShadow: {
        'neu-flat': '5px 5px 10px #bebebe, -5px -5px 10px #ffffff',
        'neu-pressed': 'inset 5px 5px 10px #bebebe, inset -5px -5px 10px #ffffff',
        'neu-flat-sm': '3px 3px 6px #bebebe, -3px -3px 6px #ffffff',
        'neu-pressed-sm': 'inset 3px 3px 6px #bebebe, inset -3px -3px 6px #ffffff',
      },
      transitionProperty: {
        'width': 'width',
      },
    },
  },
  plugins: [],
}
