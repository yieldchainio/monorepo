/**
 * A generic component with a gradient border,
 * allowing transparent background
 */

import { GradientBorderProps } from "./types";

export const GradientBorder = ({
  heavyColor,
  lightColor,
  borderRadius = "20px",
  gradientDegree = "90deg",
  style = {},
  width = "200px",
  height = "200px",
  childrenContainerStyle = {},
  borderWidth = "3px",
  className,
  globalClassname,
  children,
}: GradientBorderProps) => {
  return (
    <div
      className={
        "flex flex-col overflow-hidden items-center justify-center" +
        " " +
        (globalClassname || "")
      }
      style={{
        borderRadius: borderRadius,
      }}
    >
      <div
        className={
          "gradient-border-mask text-custom-textColor transition duration-200 ease-in-out " +
          " " +
          (className || "")
        }
        style={{
          borderRadius,
          background: `linear-gradient(${gradientDegree}, ${heavyColor}, ${lightColor}) border-box`,
          zIndex: 1,
          width,
          borderWidth,
          borderStyle: "solid",
          borderColor: "transparent",
          height,
          ...style,
        }}
      ></div>
      <div
        className="translate-y-[-100%]"
        style={{
          width: width,
          height: height,
          borderRadius: borderRadius,
          zIndex: 0,
          ...childrenContainerStyle,
        }}
      >
        {children}
      </div>
    </div>
  );
};
