/**
 * Reguler straight line
 */

/**
 * A dashed gradient line
 */

import { GradientBorderProps } from "components/gradient-border/types";

export const RegulerLine = ({
  style = {},
  width = "200px",
  height = "200px",
  borderWidth = "3px",
  className,
  color,
}: GradientBorderProps & {
  dashSize?: number;
  dashSpace?: number;
  color: string;
}) => {
  return (
    <svg
      style={{
        width: width,
        height: height,
        ...style,
      }}
      className={className}
    >
      <line
        x1="0"
        y1={"0"}
        x2={"2"}
        y2={"0"}
        stroke-width={parseInt(borderWidth)}
        stroke={color}
      >
        <animate
          attributeName="y2"
          from="0"
          to={parseInt(height)}
          dur="0.3s"
          begin="0s"
          fill="freeze"
        />
      </line>
    </svg>
  );
};
