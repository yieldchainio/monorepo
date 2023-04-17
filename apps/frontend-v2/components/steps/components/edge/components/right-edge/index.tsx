/**
 * An edge component curved to the right
 */

import { useMemo } from "react";
import { CURVE_WIDTH, EDGE_WIDTH } from "../../constants";
import { DirectedEdgeProps } from "../../types";

export const RightEdge = ({
  parentStep,
  childStep,
  childAnchor,
  parentAnchor,
  style,
  className,
}: DirectedEdgeProps) => {
  /**
   * Memoize some constants
   */

  const height = useMemo(
    () => childAnchor.y - parentAnchor.y - EDGE_WIDTH,
    [childAnchor.y, parentAnchor.y, EDGE_WIDTH]
  );
  const width = useMemo(
    () => childAnchor.x - parentAnchor.x + CURVE_WIDTH,
    [childAnchor.x, parentAnchor.x, CURVE_WIDTH]
  );

  const hLine = useMemo(
    () => childAnchor.x - parentAnchor.x - CURVE_WIDTH,
    [childAnchor.x, parentAnchor.x, CURVE_WIDTH]
  );

  // Return the JSX
  return (
    <svg
      style={{
        position: "absolute",
        top: `${parentAnchor.y}px`,
        left: `${parentAnchor.x}px`,
        width: `${width}px`,
        height: `${height}px`,

        ...style,
      }}
      className="text-custom-textColor"
    >
      <path
        d={`M0 ${EDGE_WIDTH} h ${hLine} a 50 50 0 0 1 50 50 v ${height}`}
        stroke={"currentColor"}
        stroke-width={EDGE_WIDTH}
        fill={"none"}
      ></path>
    </svg>
  );
};
