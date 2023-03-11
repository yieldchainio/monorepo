/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  theme: {
    borderRadius: {
      lg: "18px",
    },
    extend: {
      colors: {
        custom: {
          // Background colors
          bg: "var(--bg)",
          subbg: "var(--subbg)",
          bcomponentbg: "var(--bigcomponentbg)",
          componentbg: "var(--componentbg)",
          "text-color": "var(--text)",

          // Unrelated
          header: "#383838",

          // Text Colors
          off: "var(--off)",
          offhover: "var(--offhover)",
          gradient: "var(--gradient)",
          lgradient: "var(--light-gradient)",
          dimmed: "var(--dimmed)",

          // General Colors
          yclb: "#00B2EC",
          ycy: "#D9CA0F",

          ycllb: "#68DAFF",
          ycly: "#fef464",
        },
      },
    },
    fontFamily: {
      athletics: "Athletics",
    },
  },
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  plugins: [],
};
