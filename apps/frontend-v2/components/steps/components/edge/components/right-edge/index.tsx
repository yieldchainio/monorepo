/**
 * An edge component curved to the righr
 */

import { RegulerLine } from "components/lines/reguler";
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
  return (
    <svg
      style={{
        position: "absolute",
        top: `${parentAnchor.y}px`,
        left: `${parentAnchor.x}px`,
        width: `${childAnchor.x - parentAnchor.x + CURVE_WIDTH}px`,
        height: `${childAnchor.y - parentAnchor.y - EDGE_WIDTH}px`,

        ...style,
      }}
      className="text-custom-textColor"
    >
      <path
        d={`M0 ${EDGE_WIDTH} h ${
          childAnchor.x - parentAnchor.x - CURVE_WIDTH
        } a 50 50 0 0 1 50 50 v ${childAnchor.y - parentAnchor.y - EDGE_WIDTH}`}
        stroke={"currentColor"}
        stroke-width={EDGE_WIDTH}
        fill={"none"}
      />
    </svg>
  );
};
