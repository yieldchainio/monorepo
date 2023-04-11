/** @type {import('tailwindcss').Config} */

module.exports = {
  darkMode: "class",
  mode: "jit",

  theme: {
    borderRadius: {
      lg: "18px",
      xl: "0.75rem",
      "2xl": "1rem",
      "3xl": "1.5rem",
      md: "0.375rem",
      full: "9999px",
      large: "12px",
    },

    screens: {
      mobile: { max: "640px" },
      tablet: { max: "768px" },
      smallMobile: { max: "510px" },
      smallLaptop: { max: "1000px" },
      laptop: { max: "1150px" },
      largeLaptop: { max: "1550px" },
      pc: { max: "1920px" },
      largepc: { max: "2400px" },
    },

    extend: {
      boxShadow: {
        centeredXL: "0 2px 5px 8px rgba(0, 0, 0, 0.1)",
      },
      colors: {
        current: "currentColor",
        custom: {
          // Background colors
          bg: "var(--bg)",
          subbg: "var(--subbg)",
          darkSubbg: "var(--darkerSubbg)",
          componentbg: ({ opacityValue }) =>
            `rgba(var(--componentbg), ${opacityValue || 1})`,
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
          yclb: ({ opacityValue }) => `rgba(0, 178, 236, ${opacityValue || 1})`,
          ycy: ({ opacityValue }) => `rgba(217, 202, 15, ${opacityValue || 1})`,

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

          // A random color
          randomBlueish: ({ opacityValue }) => {
            const arr = [
              `rgba(104, 218, 25 ${opacityValue})`,
              `rgba(0, 178, 236 ${opacityValue})`,
              `rgba(0, 236, 193 ${opacityValue})`,
              `rgba(175, 27, 255 ${opacityValue})`,
            ];

            return arr[Math.floor(Math.random() * arr.length - 1)];
          },

          randomYellowish: () => {
            const arr = ["#d9ca0f", "#fef464", "#ffa375", "#f84f4f"];
            return arr[Math.floor(Math.random() * arr.length - 1)];
          },
        },
      },
      animation: {
        accountPopup: "accountPopup 0.2s ease-in-out",
        popup: "popup 0.2s ease-in-out",
        dropdown: "dropdown 0.2s ease-in-out",
        toolTipTop: "toolTipTop 0.2s ease-in-out",
        toolTipBottom: "toolTipBottom 0.2s ease-in-out",
        toolTipLeft: "toolTipLeft 0.2s ease-in-out",
        toolTipRight: "toolTipRight 0.2s ease-in-out",
        modal: "modal 0.2s ease-in-out",
        sidebar: "sidebar 0.2s ease-in-out",
        log: "log 0.1s ease-in-out",
      },
      keyframes: (theme) => ({
        popup: {
          "0%": {
            transform: "scale(0.5)",
          },
          "100%": {
            transform: "scale(1)",
          },
        },
        modal: {
          "0%": {
            transform: "translateY(200%)",
          },
          "100%": {
            transform: "translateY(0%)",
          },
        },
        sidebar: {
          "0%": {
            transform: "translateX(-100%)",
          },
          "100%": {
            transform: "translateX(0%)",
          },
        },
        log: {
          "0%": {
            transform: "translateY(-20%)",
          },
          "100%": {
            transform: "translateY(0%)",
          },
        },
        toolTipTop: {
          "0%": {
            transform: "translate(-50%, -125%) scale(0.25)",
          },
          "100%": {
            transform: "translate(-50%, -125%) scale(1)",
          },
        },
        toolTipBottom: {
          "0%": {
            transform: "translate(-50%, +25%) scale(0.25)",
          },
          "100%": {
            transform: "translate(-50%, +25%) scale(1)",
          },
        },
        toolTipLeft: {
          "0%": {
            transform: "translate(-125%, -50%) scale(0.25)",
          },
          "100%": {
            transform: "translate(-125%, -50%) scale(1)",
          },
        },
        toolTipRight: {
          "0%": {
            transform: "translate(+25%, -50%) scale(0.25)",
          },
          "100%": {
            transform: "translate(+25%, -50%) scale(1)",
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
      }),
      backgroundSize: {
        "size-200": "200% 200%",
      },
      backgroundPosition: {
        "pos-0": "0% 0%",
        "pos-100": "100% 100%",
      },
    },
    fontFamily: {
      athletics: "Athletics",
    },
  },
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  plugins: [
    require("@tailwindcss/forms"),
    require("tailwindcss-dotted-background"),
    require("tailwind-scrollbar-hide"),
  ],
};
