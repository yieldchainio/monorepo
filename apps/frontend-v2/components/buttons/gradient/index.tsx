import { motion } from "framer-motion";
/**
 * @notice
 * This is the main button used across the app
 */

export interface ButtonProps {
  children?: React.ReactNode;
  onClick?: (e?: React.MouseEvent<HTMLElement>) => any;
  className?: string;
}

/**
 * @param text - the text to put on the button
 * @param onClick - what to execute onClick
 * @param className - @optional tailwindcss class
 */
const GradientButton = ({ children, onClick, className }: ButtonProps) => {
  return (
    <motion.div
      className={
        "w-max max-w-[200px] h-max font-athletics font-bold text-[14.5px] flex items-center justify-center cursor-pointer z-100 hover:text-custom-textColor select-none blur-none text-black transition duration-200 ease-in-out active:scale-[0.99] py-2 px-5 tablet:px-3.5 tablet:py-1.5 " +
        (className || "")
      }
      style={{
        background: "var(--main-gradient)",
        border: "2px solid var(--subbg)",
        borderRadius: "12px",
      }}
      whileHover={{
        background:
          "linear-gradient(var(--bg), var(--bg)) padding-box, var(--main-gradient) border-box",
        border: "2px solid transparent",
      }}
    >
      {children}
    </motion.div>
  );
};

export default GradientButton;
