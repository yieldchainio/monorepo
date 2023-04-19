/**
 * An Edge component that connects between a parent and a child step
 */

import { Step } from "utilities/classes/step";
import { StraightEdge } from "./components/straight-edge";
import { EDGE_WIDTH } from "./constants";
import { GradientEdge } from "./components/gradient-edge";
import { RightEdge } from "./components/right-edge";
import { LeftEdge } from "./components/left-edge";
import { forwardRef, useMemo } from "react";
import { TokenPercentageBox } from "../token-percentage";
import { useElementPortal } from "utilities/hooks/general/useElementPortal";

export const Edge = forwardRef<
  HTMLDivElement,
  {
    parentStep: Step;
    childStep: Step;
    canvasID?: string;
  }
>(
  ({
    parentStep,
    childStep,
    canvasID,
  }: {
    parentStep: Step;
    childStep: Step;
    canvasID?: string;
  }) => {
    /**
     * Portal for the  canvas (used for percentage box tooltip)
     */
    const canvasPortal = useElementPortal(canvasID);

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
     * Switch case to decide direction, and render out corresponding edge (MEMO'ed)
     */

    const correctEdge = useMemo(() => {
      /**
       * Switch case to decide direction, and render out corresponding edge (MEMO'ed)
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
      if (parentLeftAnchor.x > childTopAnchor.x)
        return (
          <LeftEdge
            parentStep={parentStep}
            childStep={childStep}
            parentAnchor={parentLeftAnchor}
            childAnchor={childTopAnchor}
          />
        );

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
    }, [
      parentStep.position.x,
      parentStep.position.y,
      childStep.position.x,
      childStep.position.y,
    ]);

    /**
     * Memo the middle point for the token percentage box
     */
    const middlePoint = useMemo(() => {
      return {
        x: correctEdge.props.childAnchor.x,
        y:
          correctEdge.props.parentAnchor.y +
          (correctEdge.props.childAnchor.y - correctEdge.props.parentAnchor.y) /
            2,
      };
    }, [
      parentStep.position.x,
      parentStep.position.y,
      childStep.position.x,
      childStep.position.y,
    ]);

    return (
      <div className=" w-max h-max">
        {correctEdge}
        {childStep.state !== "empty" && childStep.outflows.length ? (
          <TokenPercentageBox
            step={childStep}
            triggerComparison={() => null}
            style={{
              left: `${middlePoint.x}px`,
              top: `${middlePoint.y}px`,
              transform: "translate(-50%, -50%)",
            }}
            portal={canvasPortal}
          ></TokenPercentageBox>
        ) : null}
      </div>
    );
  }
);
