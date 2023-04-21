/**
 * A generic component with a gradient border,
 * allowing transparent background
 */

import { DashedGradientBorder } from "./dashed";
import { GradientBorderProps } from "./types";

export const GradientBorder = ({
  heavyColor = "var(--yc-lb)",
  lightColor = "var(--yc-y)",
  borderRadius = "20px",
  gradientDegree = "90deg",
  style = {},
  width = "200px",
  height = "200px",
  childrenContainerStyle = {},
  borderWidth = "3px",
  className,
  globalClassname,
  childrenContainerClassname,
  dashed = false,
  children,
}: GradientBorderProps) => {
  if (dashed)
    return (
      <DashedGradientBorder
        heavyColor={heavyColor}
        lightColor={lightColor}
        borderRadius={borderRadius}
        gradientDegree={gradientDegree}
        style={style}
        width={width}
        height={height}
        childrenContainerStyle={childrenContainerStyle}
        borderWidth={borderWidth}
        className={className}
        globalClassname={globalClassname}
        children={children}
      />
    );
  return (
    <div
      className={
        "flex flex-col overflow-hidden items-center justify-center pointer-events-none" +
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
        className={
          "translate-y-[-100%] pointer-events-auto" +
          " " +
          (childrenContainerClassname || "")
        }
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
