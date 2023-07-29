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
          bg: ({ opacityValue }) => `rgba(var(--bg), ${opacityValue || 1})`,
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
          off: ({ opacityValue }) => `rgba(var(--off), ${opacityValue || 1})`,
          offhover: "var(--offhover)",
          gradient: "var(--gradient)",
          lgradient: "var(--light-gradient)",

          dimmed: ({ opacityValue }) =>
            `rgba(var(--dimmed), ${opacityValue || 1})`,

          // General Colors
          yclb: ({ opacityValue }) => `rgba(var(--ycb), ${opacityValue || 1})`,
          ycb: ({ opacityValue }) => `rgba(var(--ycb), ${opacityValue || 1})`,
          ycy: ({ opacityValue }) => `rgba(var(--ycy), ${opacityValue || 1})`,

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
        modal: "modal 0.3s ease-in-out",
        sidebar: "sidebar 0.2s ease-in-out",
        log: "log 0.1s ease-in-out",
        configSlide: "configSlide 0.3s ease-in-out",
        fill: "fill 0.4s ease-in-out",
        stepPopup: "stepPopup 0.2s ease-in-out",
        straightEdge: "straightEdge 0.5s ease-in-out",
        slideLeft: "slideLeft 0.2s ease-in-out",
        errorShake: "errorShake 0.4s 1 linear",
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
        straightEdge: {
          "0%": {
            transform: "scaleY(0)",
          },
          "100%": {
            transform: "scaleY(1)",
          },
        },
        stepPopup: {
          "0%": {
            transform: "scale(0.5) translateX(-50%)",
          },
          "100%": {
            transform: "scale(1) translateX(-50%)",
          },
        },
        fill: {
          "0%": {
            width: "0%",
          },
          "100%": {
            width: "100%",
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
        slideLeft: {
          "0%": {
            transform: "translateX(100%)",
            opacity: "0%",
          },
          "100%": {
            transform: "translateX(0%)",
            opacity: "100%",
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
        configSlide: {
          "0%": {
            transform: "translateX(100vw)",
          },
          "100%": {
            transform: "translateX(0px)",
          },
        },
        errorShake: {
          "0%": { transform: "translate(30px)" },
          "20%": { transform: "translate(-30px)" },
          "40%": { transform: "translate(15px)" },
          "60%": { transform: "translate(-15px)" },
          "80%": { transform: "translate(8px) " },
          "100%": { transform: "translate(0px)" },
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
