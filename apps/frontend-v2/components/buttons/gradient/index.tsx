import { motion } from "framer-motion";
/**
 * @notice
 * This is the main button used across the app
 */

export interface ButtonProps {
  text: string;
  onClick: (e?: React.MouseEvent<HTMLElement>) => any;
  className?: string;
}

/**
 * @param text - the text to put on the button
 * @param onClick - what to execute onClick
 * @param className - @optional tailwindcss class
 */
const Button = ({ text, onClick, className }: ButtonProps) => {
  return (
    <motion.div
      className={
        "w-[195px] h-[44px] font-athletics font-bold text-[14.5px] flex items-center justify-center ml-auto cursor-pointer z-100 select-none blur-none" +
        (className || "")
      }
      style={{
        background: "var(--light-gradient)",
        color: "black",
        borderRadius: "12px",
      }}
      whileHover={{
        background:
          "linear-gradient(var(--bg), var(--bg)) padding-box, var(--light-gradient) border-box",
        border: "1px solid transparent",
        color: "var(--text)",
        scale: 1.01,
      }}
      whileTap={{
        scale: 0.99,
      }}
    >
      {text}
    </motion.div>
  );
};

export default Button;
