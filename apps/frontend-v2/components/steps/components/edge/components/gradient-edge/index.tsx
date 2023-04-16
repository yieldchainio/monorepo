/**
 * A unique gradient edge,
 * used to connect between parents and "Empty" palceholder childs, which are used to add new steps
 *
 * (And hence the colored, unique emphasis - Since it is a special one)
 */

import { DashedGradientLine } from "components/lines/dashed-gradient";
import { EDGE_WIDTH } from "../../constants";
import { DirectedEdgeProps } from "../../types";

export const GradientEdge = ({
  parentStep,
  childStep,
  childAnchor,
  parentAnchor,
  style,
}: DirectedEdgeProps) => {
  return (
    <DashedGradientLine
      width={`${EDGE_WIDTH * 1.5}px`}
      height={`${childAnchor.y - parentAnchor.y}px`}
      style={{
        position: "absolute",
        top: `${parentAnchor.y}px`,
        opacity: " 50%",
        ...style,
      }}
      className="blur-[0.5px]"
    />
  );
};
