import { motion, variants } from "framer-motion";

export const ChooseActionButtonVariants = {
  normal: {
    backgroundColor: "rgb(35, 45, 49)",
  },
  hover: {
    backgroundColor: "rgb(31, 39, 43)",
    scale: 1.025,
    transition: {
      duration: 0.2,
    },
  },
  tap: {
    scale: 0.9,
    transition: {
      duration: 0.25,
    },
  },
};

export const OnOffSliderVariants = {
  off: {
    backgroundColor: "#050505",
  },
  on: {
    backgroundColor: "linear-gradient(90deg, #00B2EC 0%, #D9CA0F 100%)",
  },
};
