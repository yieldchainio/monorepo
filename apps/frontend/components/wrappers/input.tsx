import { ChangeEvent, forwardRef, useEffect, useRef } from "react";
import WrappedImage from "./image";
import { InputProps, Selection } from "./types";
import WrappedText from "./text";
/**
 * @notice
 * Wrapper image component,
 * for ease of use with skeletons and global styling
 */

const WrappedInput = forwardRef<HTMLInputElement, InputProps>(
  (
    {
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
      defaultValue,
      min,
      max,
    }: InputProps,
    ref
  ) => {
    return (
      <div className="w-full flex flex-col justify-center items-end relative gap-1">
        {title && (
          <WrappedText className="self-start ml-2" fontSize={14}>
            {title}
          </WrappedText>
        )}
        <input
          ref={ref}
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
          onChange={onChange}
          onClick={() => {
            if (typeof ref == "object") ref?.current?.focus();
          }}
          placeholder={placeholder}
          type={type}
          style={style || {}}
          value={value}
          defaultValue={defaultValue}
          // min={min}
          // max={max}
          // onKeyUp={async () => {
          //   await new Promise((res) => setTimeout(() => res(true), 1000));
          //   if (parseFloat(ref.current?.value || "0") < (min || -100000000))
          //     (ref.current || { value: "0" }).value = min?.toString() || "";

          //   if (parseFloat(ref.current?.value || "0") > (max || 10000000000000))
          //     (ref.current || { value: "0" }).value = max?.toString() || "";
          // }}
          step="0.01"
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
  }
);

WrappedInput.displayName = "WrappedInput";

export default WrappedInput;
