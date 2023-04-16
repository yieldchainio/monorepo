/**
 * A dashed gradient line
 */

import { GradientBorderProps } from "components/gradient-border/types";

export const DashedGradientLine = ({
  heavyColor = "var(--yc-lb)",
  lightColor = "var(--yc-yellow)",
  style = {},
  width = "200px",
  height = "200px",
  borderWidth = "3px",
  className,
  dashSize = 8,
  dashSpace = 10,
  onClick,
}: GradientBorderProps & { dashSize?: number; dashSpace?: number }) => {
  return (
    <svg
      style={{
        width: width,
        height: height,
        ...style,
      }}
      className={className}
    >
      <defs>
        <linearGradient id="gradient">
          <stop offset="0%" stop-color={heavyColor} />
          <stop offset="100%" stop-color={lightColor} />
        </linearGradient>
      </defs>
      <line
        x1="0"
        y1={"0"}
        x2={"2"}
        y2={"0"}
        stroke-width={parseInt(borderWidth)}
        stroke="url(#gradient)"
        stroke-dasharray={`${dashSize} ${dashSpace}`}
      >
        <animate
          attributeName="y2"
          from="0"
          to={parseInt(height)}
          dur="0.3s"
          begin="0.2s"
          fill="freeze"
        />
      </line>
    </svg>
  );
};
