import { ChildrenProvider } from "components/internal/render-children";
import { motion } from "framer-motion";
import { CSSProperties, forwardRef } from "react";
/**
 * @notice
 * This is the main button used across the app
 */

interface ButtonProps {
  children?: React.ReactNode;
  onClick?: (e?: React.MouseEvent<HTMLElement>) => any;
  className?: string;
  width?: `w-${string}`;
  style?: CSSProperties;
}

/**
 * @param text - the text to put on the button
 * @param onClick - what to execute onClick
 * @param className - @optional tailwindcss class
 */

const GradientButton = forwardRef<
  HTMLDivElement,
  ButtonProps & { disabled: boolean }
>(
  (
    {
      children,
      onClick,
      className,
      width = "w-max",
      style,
      disabled = false,
      ...props
    }: ButtonProps & { disabled?: boolean },
    ref
  ) => {
    return (
      <motion.div
        ref={ref}
        className={
          width +
          " " +
          " max-w-[400px] h-max font-athletics font-bold text-[14.5px] flex items-center justify-center cursor-pointer z-100 hover:text-custom-textColor select-none blur-none text-black transition duration-200 ease-in-out active:scale-[0.99] py-2 px-5 tablet:px-3.5 tablet:py-1.5 " +
          (disabled
            ? "pointer-events-none opacity-40 cursor-not-allowed "
            : "") +
          " " +
          (className || "")
        }
        style={{
          background: "var(--main-gradient)",
          border: "2px solid var(--subbg)",
          borderRadius: "12px",
          ...style,
        }}
        whileHover={{
          background:
            "linear-gradient(rgb(var(--bg)), rgb(var(--bg))) padding-box, var(--main-gradient) border-box",
          border: "2px solid transparent",
        }}
        onClick={onClick}
        {...props}
      >
        <ChildrenProvider
          textProps={{
            fontColor: "inherit",
          }}
        >
          {children}
        </ChildrenProvider>
      </motion.div>
    );
  }
);

GradientButton.displayName = "GradientButton";

export default GradientButton;
