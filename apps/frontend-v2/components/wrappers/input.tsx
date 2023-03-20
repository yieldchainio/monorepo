import { ChangeEvent } from "react";
import WrappedImage from "./image";
import { TextSkeleton } from "./skeleton";
/**
 * @notice
 * Wrapper image component,
 * for ease of use with skeletons and global styling
 */

interface InputProps {
  fontSize: number;
  fontStyle: string;
  placeholder?: string;
  placeholderClassname?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => any;
  icon?: string;
  showGlass?: boolean;
  fontColor?: string;
  select?: Selection;
  onClick?: (e: React.MouseEvent<HTMLElement>) => any | void | null;
  fontFamily?: string;
  className?: string;
}

export enum Selection {
  allow = "select-text",
  disallow = "select-none",
}

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
  select = Selection.allow,
  className = "",
}: InputProps) => {
  return (
    <div className="w-2/3 flex justify-end items-center relative">
      <input
        className={`${
          "w-full focus:outline-none h-min py-3 bg-custom-bg border-1 border-custom-themedBorder rounded-lg border-opacity-40 focus:border-[2px] pl-5 " +
          "text-" +
          `[${fontSize.toString()}px]` +
          " font-" +
          fontFamily +
          " font-" +
          fontStyle +
          " text-" +
          fontColor +
          " " +
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
