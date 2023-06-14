/**
 * An edge component curved to the left
 */

import { CURVE_WIDTH, EDGE_WIDTH } from "../../constants";
import { DirectedEdgeProps } from "../../types";

export const LeftEdge = ({
  parentStep,
  childStep,
  childAnchor,
  parentAnchor,
  style,
  className,
}: DirectedEdgeProps) => {
  return (
    <svg
      style={{
        position: "absolute",
        top: `${parentAnchor.y}px`,
        left: `${parentAnchor.x}px`,
        width: `${parentAnchor.x - childAnchor.x + CURVE_WIDTH}px`,
        height: `${childAnchor.y - parentAnchor.y - EDGE_WIDTH}px`,
        transform: "translateX(-100%)",
        zIndex: -1,
        ...style,
      }}
      className="text-custom-textColor"
    >
      <path
        d={`M0 ${EDGE_WIDTH} h ${
          parentAnchor.x - childAnchor.x - CURVE_WIDTH
        } a 50 50 0 0 1 50 50 v ${childAnchor.y - parentAnchor.y - EDGE_WIDTH}`}
        stroke={"currentColor"}
        strokeWidth={EDGE_WIDTH}
        fill={"none"}
        transform={`translate(${
          parentAnchor.x - childAnchor.x + CURVE_WIDTH
        }, 0) scale(-1,1)`}
      ></path>
    </svg>
  );
};
