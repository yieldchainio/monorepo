/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  theme: {
    borderRadius: {
      lg: "18px",
    },

    extend: {
      colors: {
        current: "currentColor",
        custom: {
          // Background colors
          bg: "var(--bg)",
          subbg: "var(--subbg)",
          componentbg: "var(--componentbg)",
          textColor: ({ opacityValue }) =>
            `rgba(var(--text), ${opacityValue || 1})`,

          // Unrelated
          header: "var(--header)",

          // Text Colors
          off: "var(--off)",
          offhover: "var(--offhover)",
          gradient: "var(--gradient)",
          lgradient: "var(--light-gradient)",

          dimmed: ({ opacityValue }) =>
            `rgba(var(--dimmed), ${opacityValue || 1})`,

          // General Colors
          yclb: "#00B2EC",
          ycy: "#D9CA0F",

          ycllb: "#68DAFF",
          ycly: "#fef464",

          lightcomponent: "var(--lightcomponent)",

          skeleton: "var(--skeleton)",

          border: "var(--border)",

          themedBorder: "var(--themed-border)",

          bcomponentbg: ({ opacityValue }) =>
            `rgba(var(--bigcomponentbg), ${opacityValue || 1})`,

          dropdown: ({ opacityValue }) =>
            `rgba(var(--dropdown), ${opacityValue || 1})`,

          lightHover: "var(--lighthover)",
        },
      },
    },
    fontFamily: {
      athletics: "Athletics",
    },
  },
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  plugins: [],
};
