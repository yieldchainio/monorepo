/**
 * An Edge component that connects between a parent and a child step
 */

import { Step } from "utilities/classes/step";
import { StraightEdge } from "./components/straight-edge";
import { EDGE_WIDTH } from "./constants";
import { GradientEdge } from "./components/gradient-edge";
import { RightEdge } from "./components/right-edge";

export const Edge = ({
  parentStep,
  childStep,
}: {
  parentStep: Step;
  childStep: Step;
}) => {
  /**
   * Get shortands of some positioning propreties of both the parent and the child
   */

  // @notice
  // We have this shorthand for the X positions since the X positions are
  // always manipulated using transform translateX(-50%).
  const parentX = parentStep.position.x - parentStep.dimensions.width / 2;
  const childX = childStep.position.x - childStep.dimensions.width / 2;

  const parentBottomAnchor = {
    x: parentX + parentStep.dimensions.width / 2 - EDGE_WIDTH,
    y: parentStep.position.y + parentStep.dimensions.height,
  };

  const parentLeftAnchor = {
    x: parentX,
    y: parentStep.position.y + parentStep.dimensions.height / 2 - EDGE_WIDTH,
  };

  const parentRightAnchor = {
    x: parentX + parentStep.dimensions.width,
    y: parentStep.position.y + parentStep.dimensions.height / 2 - EDGE_WIDTH,
  };

  // We know that the steps are always transformed -50% to the left, so the position itself is sufficient for X here
  const childTopAnchor = {
    x: childX + childStep.dimensions.width / 2 - EDGE_WIDTH,
    y: childStep.position.y,
  };

  /**
   * Switch case to decide direction, and render out corresponding edge
   */

  // If the child is an empty child, we assume it is directly under the parent anyway and return a gradient edge
  if (childStep.state === "empty") {
    return (
      <GradientEdge
        parentStep={parentStep}
        childStep={childStep}
        parentAnchor={parentBottomAnchor}
        childAnchor={childTopAnchor}
      />
    );
  }

  // If parent's left anchor is further away than the child's top anchor, we return a left edge
  if (parentLeftAnchor.x > childTopAnchor.x) {
    return <div>Left Edge</div>;
  }

  // If the parent's right anchor is closer to the left side than the child's top anchor, we return a right edge
  if (parentRightAnchor.x < childTopAnchor.x)
    return (
      <RightEdge
        parentStep={parentStep}
        childStep={childStep}
        parentAnchor={parentRightAnchor}
        childAnchor={childTopAnchor}
      />
    );

  // Otherwise, we return a straight edge
  return (
    <StraightEdge
      parentStep={parentStep}
      childStep={childStep}
      parentAnchor={parentBottomAnchor}
      childAnchor={childTopAnchor}
      //   style={style}
    />
  );
};
