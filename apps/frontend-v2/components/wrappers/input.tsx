import { ChangeEvent } from "react";
import WrappedImage from "./image";
import { InputProps, Selection } from "./types";
/**
 * @notice
 * Wrapper image component,
 * for ease of use with skeletons and global styling
 */

const WrappedInput = ({
  fontSize = 14,
  fontStyle = "reguler",
  fontFamily = "athletics",
  fontColor = "custom-textColor",
  onClick,
  onChange = (e: ChangeEvent<HTMLDivElement>) => console.log("Default"),
  icon = "/icons/search-glass.svg",
  showGlass = true,
  placeholder = "Your input goes here:",
  placeholderClassname = "text-opacity-50",
  select = Selection.disallow,
  className = "",
}: InputProps) => {
  return (
    <div className="w-2/3 flex justify-end items-center relative">
      <input
        className={`${
          "w-full focus:outline-none h-min py-3 bg-custom-bg border-[1px] border-custom-themedBorder rounded-lg border-opacity-40 focus:border-custom-border pl-5 transition duration-200 ease-in-out pr-[12vw] " +
          "text-" +
          `[${fontSize.toString()}px]` +
          " font-" +
          fontFamily +
          " font-" +
          fontStyle +
          " text-" +
          fontColor +
          "select-none " +
          className
        } `}
        onClick={(e: React.MouseEvent<HTMLElement>) =>
          onClick ? onClick(e) : null
        }
        onChange={onChange}
        placeholder={placeholder}
      />
      <WrappedImage
        src={icon}
        width={32}
        height={32}
        className="absolute pointer-events-none mr-6"
      />
    </div>
  );
};

export default WrappedInput;
