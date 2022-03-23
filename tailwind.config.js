/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  mode: "jit",
  theme: {
    extend: {},
    fontFamily: {
      sans: ["\"Exo 2\"", ...defaultTheme.fontFamily.sans]
    }
  },
  plugins: []
};
