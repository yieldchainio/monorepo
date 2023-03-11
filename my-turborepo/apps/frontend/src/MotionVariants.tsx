import { motion, variants } from "framer-motion";

export const ButtonVariants = {
  normal: {
    background:
      "linear-gradient(90deg, rgb(0, 178, 236) 0%, rgb(217, 202, 15) 100%)",
    color: "rgb(0, 0, 0)",
  },
  hover: {
    background:
      "linear-gradient(black, black) padding-box,linear-gradient(90deg, rgb(0, 178, 236) 0%, rgb(217, 202, 15) 100%) border-box",
    border: "1px solid transparent",
    color: "rgb(255, 255, 255, 255)",
    scale: 1.05,
  },
};
