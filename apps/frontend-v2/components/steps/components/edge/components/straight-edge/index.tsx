/**
 * A straight reguler edge component
 */

import { RegulerLine } from "components/lines/reguler";
import { EDGE_WIDTH } from "../../constants";
import { DirectedEdgeProps } from "../../types";

export const StraightEdge = ({
  parentStep,
  childStep,
  childAnchor,
  parentAnchor,
  style,
}: DirectedEdgeProps) => {
  return (
    <RegulerLine
      className="text-custom-textColor"
      color="currentColor"
      width={`${EDGE_WIDTH}px`}
      height={`${childAnchor.y - parentAnchor.y}px`}
      style={{
        position: "absolute",
        top: `${parentAnchor.y}px`,
        ...style,
      }}
    />
  );
};
