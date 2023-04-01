import { ToolTipDirection } from "./types";

/**
 * Calculate the position of the tooltip based on a provided direction and a wrapped child' bounding rects
 * @param direction - the direction of the tooltip, relative to the child
 * @param childRects  - the bounding rects of the child (retreived by calling childref.getBoundingClientRect()...)
 * @returns The positions to position the tooltip (top, left, transform)
 */
export const positionTooltip = (
  direction: ToolTipDirection,
  childRects: DOMRect | false
): {
  top: number;
  left: number;
  transform: string;
} => {
  if (!childRects)
    return {
      left: 0,
      top: 0,
      transform: "",
    };
  // The base positioning
  const returnObj = {
    left: childRects.x,
    top: childRects.y + window.scrollY,
    transform: "",
  };

  /**
   * A switch case for the directions, adding/substracting corresponding positions for the tooltip
   */
  switch (direction) {
    case ToolTipDirection.TOP:
      returnObj.left += childRects.width / 2;
      returnObj.transform = "translate(-50%, -150%)";
      return returnObj;

    case ToolTipDirection.BOTTOM:
      returnObj.left += childRects.width / 2;
      returnObj.top += childRects.height;
      returnObj.transform = "translate(-50%, +50%)";
      return returnObj;

    case ToolTipDirection.LEFT:
      returnObj.transform = "translate(-125%, -50%)";
      returnObj.top += childRects.height / 2;
      return returnObj;

    case ToolTipDirection.RIGHT:
      returnObj.left += childRects.width;
      returnObj.top += childRects.height / 2;
      returnObj.transform = "translate(+50%, -50%)";
      return returnObj;
  }
};
