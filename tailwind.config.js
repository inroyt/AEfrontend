/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}",],
  theme: {
    extend: {
      boxShadow: {
        custom: '2px 3px 5px rgba(0, 0, 0, 0.25)',
      },
    },
    fontFamily: {
      kaushan: ["kaushan"],
      roboto:["roboto"],
      raleway:["raleway"],
      merienda:["merienda"],
     
    },
  },

  transitionDuration: {
    DEFAULT: "300ms",
  },
  plugins: [],
  darkMode: "class", //or 'media'
};
