/**
 * A gradient border component that is dashed
 */

import { GradientBorderProps } from "./types";

export const DashedGradientBorder = ({
  heavyColor,
  lightColor,
  borderRadius = "20px",
  style = {},
  width = "200px",
  height = "200px",
  childrenContainerStyle = {},
  borderWidth = "3px",
  className,
  globalClassname,
  childrenContainerClassname,
  children,
  dashSize = 8,
  dashSpace = 10,
  onClick,
}: GradientBorderProps & { dashSize?: number; dashSpace?: number }) => {
  return (
    <div
      className={
        "flex flex-col overflow-hidden w-max items-center justify-center" +
        " " +
        (globalClassname || "")
      }
      style={{
        borderRadius: borderRadius,
        ...style,
      }}
      onClick={onClick}
    >
      <svg
        style={{
          zIndex: 1,
          width: width,
          height: height,
          cursor: "pointer",
        }}
        className={className}
      >
        <defs>
          <linearGradient id="gradient">
            <stop offset="0%" stop-color={heavyColor} />
            <stop offset="100%" stop-color={lightColor} />
          </linearGradient>
        </defs>
        <rect
          x="1.5"
          y="1.5"
          width={`calc(${width} - ${borderWidth})`}
          height={`calc(${height} - ${borderWidth})`}
          rx={parseInt(borderRadius)}
          fill="transparent"
          stroke-width={borderWidth}
          stroke="url(#gradient)"
          stroke-dasharray={`${dashSize} ${dashSpace}`}
        />
      </svg>
      <div
        className={"absolute" + " " + (childrenContainerClassname || "")}
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
