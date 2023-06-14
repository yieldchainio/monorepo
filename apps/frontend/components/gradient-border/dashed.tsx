/**
 * A gradient border component that is dashed
 */

import { forwardRef } from "react";
import { GradientBorderProps } from "./types";

/* eslint-disable react/display-name */
export const DashedGradientBorder = forwardRef<
  HTMLDivElement,
  GradientBorderProps & { dashSize?: number; dashSpace?: number }
>(
  (
    {
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
    }: GradientBorderProps & { dashSize?: number; dashSpace?: number },
    ref
  ) => {
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
        ref={ref}
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
              <stop offset="0%" stopColor={heavyColor} />
              <stop offset="100%" stopColor={lightColor} />
            </linearGradient>
          </defs>
          <rect
            x="1.5"
            y="1.5"
            width={`calc(${width} - ${borderWidth})`}
            height={`calc(${height} - ${borderWidth})`}
            rx={parseInt(borderRadius)}
            fill="transparent"
            strokeWidth={borderWidth}
            stroke="url(#gradient)"
            strokeDasharray={`${dashSize} ${dashSpace}`}
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
  }
);
