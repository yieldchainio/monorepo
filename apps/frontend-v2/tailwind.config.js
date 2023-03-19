/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  theme: {
    borderRadius: {
      lg: "18px",
    },

    screens: {
      mobile: { max: "640px" },
      tablet: { max: "768px" },
      smallLaptop: { max: "1000px" },
      laptop: { max: "1150px" },
      pc: { max: "1920px" },
      largepc: { max: "2400px" },
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
          header: ({ opacityValue }) =>
            `rgba(var(--header), ${opacityValue || 1})`,

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
          borderHover: "var(--border-hover)",

          themedBorder: "var(--themed-border)",

          bcomponentbg: ({ opacityValue }) =>
            `rgba(var(--bigcomponentbg), ${opacityValue || 1})`,

          dropdown: ({ opacityValue }) =>
            `rgba(var(--dropdown), ${opacityValue || 1})`,

          lightHover: "var(--lighthover)",

          button: "var(--button)",
          buttonHover: "var(--buttonHover)",
        },
      },
      animation: {
        accountPopup: "accountPopup 0.2s ease-in-out",
        popup: "popup 0.2s ease-in-out",
        dropdown: "dropdown 0.2s ease-in-out",
      },
      keyframes: {
        popup: {
          "0%": {
            transform: "scale(0.5)",
          },
          "100%": {
            transform: "scale(1)",
          },
        },
        dropdown: {
          "0%": {
            height: "100%",
          },
          "100%": {
            height: "max",
          },
        },
        accountPopup: {
          "0%": {
            transform: "translateX(-100px) scale(0)",
          },
          "100%": {
            transform: "translateX(-100px) scale(1)",
          },
        },
        modalAppear: {
          "0%": {
            transform: "translateY(100vw)",
          },
          "100%": {
            transform: "translateY(0px)",
          },
        },
      },
    },
    fontFamily: {
      athletics: "Athletics",
    },
  },
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  plugins: [require("@tailwindcss/forms")],
};
