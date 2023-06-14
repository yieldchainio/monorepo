import { MouseEvent } from "react";
import { ToolTipDirection } from "./types";

/**
 * Calculate the position of the tooltip based on a provided direction and a wrapped child' bounding rects
 * @param direction - the direction of the tooltip, relative to the child
 * @param childRects  - the bounding rects of the child (retreived by calling childref.getBoundingClientRect()...)
 * @returns The positions to position the tooltip (top, left, transform)
 */
export const positionTooltip = (
  direction: ToolTipDirection,
  childRects: Omit<DOMRect, "bottom" | "right" | "toJSON"> | false
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
    left: childRects.x + window.scrollX,
    top: childRects.y + window.scrollY,
    transform: "",
  };

  /**
   * A switch case for the directions, adding/substracting corresponding positions for the tooltip
   */
  switch (direction) {
    case ToolTipDirection.TOP:
      returnObj.left += childRects.width / 2;
      returnObj.transform = "translate(-50%, -125%)";
      return returnObj;

    case ToolTipDirection.BOTTOM:
      returnObj.left += childRects.width / 2;
      returnObj.top += childRects.height;
      returnObj.transform = "translate(-50%, +25%)";
      return returnObj;

    case ToolTipDirection.LEFT:
      returnObj.transform = "translate(-125%, -50%)";
      returnObj.top += childRects.height / 2;
      return returnObj;

    case ToolTipDirection.RIGHT:
      returnObj.left += childRects.width;
      returnObj.top += childRects.height / 2;
      returnObj.transform = "translate(+25%, -50%)";
      return returnObj;
  }
};

/**
 * Apply arguments to triggers
 */

export const applyTriggerArgs = (
  triggers: Record<
    string,
    (e: MouseEvent<HTMLDivElement, MouseEvent>, i: number | null) => void
  >,
  key: number | null,
  consumerProps: Record<string, any>
): Record<string, (e: MouseEvent<HTMLDivElement, MouseEvent>) => void> => {
  // Initiate a result object
  const res: Record<
    string,
    (e: MouseEvent<HTMLDivElement, MouseEvent>) => void
  > = {};

  // We iterate over each trigger, and assigning to our result object a function that takes in only
  // the mouse event, then calls the trigger's function with that event + our constant inputted key (the index)
  for (const trigger in triggers) {
    res[trigger] = (e: MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (consumerProps[trigger]) consumerProps[trigger](e, key);
      triggers[trigger](e, key);
    };
  }

  return res;
};
