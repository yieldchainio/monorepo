import { ChangeEvent } from "react";
import WrappedImage from "./image";
import { InputProps, Selection } from "./types";
import WrappedText from "./text";
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
  onChange = (e: ChangeEvent<HTMLDivElement>) => null,
  icon = "/icons/search-glass.svg",
  showGlass = true,
  placeholder = "Your input goes here:",
  placeholderClassname = "text-opacity-50",
  select = Selection.disallow,
  className = "",
  iconProps,
  width = `w-full`,
  type,
  style,
  title,
  value,
}: InputProps) => {
  return (
    <div className="w-full flex flex-col justify-center items-end relative gap-1">
      {title && (
        <WrappedText className="self-start ml-2" fontSize={14}>
          {title}
        </WrappedText>
      )}
      <input
        className={`${
          width +
          " " +
          "focus:outline-none h-min py-3 bg-custom-bg border-[1px] border-custom-themedBorder rounded-lg border-opacity-40 focus:border-custom-border pl-5 transition duration-200 ease-in-out pr-[20%] " +
          "text-" +
          `[${fontSize.toString()}px]` +
          " font-" +
          fontFamily +
          " font-" +
          fontStyle +
          " text-custom-textColor" +
          " " +
          "select-none focus:ring-0 focus:ring-offset-0" +
          className
        } `}
        onClick={(e: React.MouseEvent<HTMLElement>) =>
          onClick ? onClick(e) : null
        }
        onChange={onChange}
        placeholder={placeholder}
        type={type}
        style={style || {}}
        value={value}
      />
      {showGlass &&
        (typeof icon == "string" ? (
          <WrappedImage
            src={icon}
            width={iconProps?.width || 32}
            height={iconProps?.height || 32}
            className="absolute pointer-events-none mr-6"
          />
        ) : (
          icon
        ))}
    </div>
  );
};

export default WrappedInput;
