/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        customFont: ["Rubik", "sans-serif"],
      },
    },
    screens: {
      'xl': {'max': '1023px'},
      'md': {'max': '767px'},
      'sm': {'max': '550px'},
      "mob": {"max": "400px"},
      "mobsmall": {"max": "360px"}
    }
  },
  plugins: [],
}

