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
        "w-max max-w-[200px] h-max font-athletics font-bold text-[14.5px] flex items-center justify-center ml-auto cursor-pointer z-100 text-black select-none blur-none hover:scale-[1.01] hover:text-custom-textColor transition duration-200 ease-in-out active:scale-[0.99] border-[1px] border-custom-dimmed py-2 px-5 tablet:px-3.5 tablet:py-1.5 " +
        (className || "")
      }
      style={{
        background: "var(--light-gradient)",
        borderRadius: "12px",
      }}
      whileHover={{
        background:
          "linear-gradient(var(--bg), var(--bg)) padding-box, var(--light-gradient) border-box",
        border: "1px solid transparent",
      }}
    >
      {text}
    </motion.div>
  );
};

export default Button;
