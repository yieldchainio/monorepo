/**
 * An Edge component that connects between a parent and a child step
 */

import { Step } from "utilities/classes/step";
import { StraightEdge } from "./components/straight-edge";
import { EDGE_WIDTH } from "./constants";
import { GradientEdge } from "./components/gradient-edge";

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

  const parentBottomAnchor = {
    x: parentStep.position.x + parentStep.dimensions.width / 2 - EDGE_WIDTH,
    y: parentStep.position.y + parentStep.dimensions.height,
  };

  const parentLeftAnchor = {
    x: parentStep.position.x,
    y: parentStep.position.y + parentStep.dimensions.height / 2 - EDGE_WIDTH,
  };

  const parentRightAnchor = {
    x: parentStep.position.x + parentStep.dimensions.width,
    y: parentStep.position.y + parentStep.dimensions.height / 2 - EDGE_WIDTH,
  };

  const childTopAnchor = {
    x: childStep.position.x + childStep.dimensions.width / 2 - EDGE_WIDTH,
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
  if (parentRightAnchor.x < childTopAnchor.x) return <div>Right Edge</div>;

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
