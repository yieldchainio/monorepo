import React, {
  FunctionComponent,
  useState,
  useEffect,
  useContext,
  useRef,
  useLayoutEffect,
} from "react";
import styles from "../css/strategyBuilder.module.css";
import { motion } from "framer-motion";
import { DatabaseContext, StrategyContext } from "../Contexts/DatabaseContext";
import { ButtonVariants } from "../MotionVariants";
import { ChooseActionButtonVariants } from "./AnimationVariants";
import { HoverDetails } from "../HoverDetails";
import { SizingEnum, NodeStepEnum } from "./Enums";
import { RightEdge, LeftEdge, StraightEdge } from "../Lines";

export const AutoLine = (props: any) => {
  const { strategySteps, setStrategySteps } = useContext(StrategyContext);

  const { parentNode, childNode, percentageModalHandler } = props;

  const pixelsToNumber = (pixels: string | number) => {
    if (typeof pixels === "number") return pixels;
    return Number(pixels.replace("px", ""));
  };

  const childWidth = pixelsToNumber(childNode.width);
  const childHeight = pixelsToNumber(childNode.height);
  const parentWidth = pixelsToNumber(parentNode.width);
  const parentHeight = pixelsToNumber(parentNode.height);
  const parentX = pixelsToNumber(parentNode.position.x);
  const parentY = pixelsToNumber(parentNode.position.y);
  const childX = pixelsToNumber(childNode.position.x);
  const childY = pixelsToNumber(childNode.position.y);
  const percentage = childNode.percentage;

  // Child Anchor Points
  const childRightAnchorX = childX + childWidth + 1; // +1 to account for the line width
  const childRightAnchorY = childY + childHeight / 2 + 1; // +1 to account for the line width
  const childLeftAnchorX = childX - 1; // -1 to account for the line width
  const childLeftAnchorY = childY + childHeight / 2 + 1; // +1 to account for the line width
  const childTopAnchorX = childX + childWidth / 2 + 1; // +1 to account for the line width
  const childTopAnchorY = childY; // -1 to account for the line width

  // Parent Anchor Points
  const parentBottomAnchorX = parentX + parentWidth / 2 + 1; // +1 to account for the line width
  const parentBottomAnchorY = parentY + parentHeight + 1; // +1 to account for the line width
  const parentRightAnchorX = parentX + parentWidth + 1; // +1 to account for the line width
  const parentRightAnchorY = parentY + parentHeight / 2 + 1; // +1 to account for the line width
  const parentLeftAnchorX = parentX - 1; // -1 to account for the line width
  const parentLeftAnchorY = parentY + parentHeight / 2 + 1; // +1 to account for the line width

  // Checks whether the child is considered a Placeholder Node, for styling purposes (i.e,
  // It wont have a percentage box and the line would be dashed instead of solid)
  let isPlaceholder = childNode.type == NodeStepEnum.PLACEHOLDER;

  let direction: any;

  // Determine The Direction Of The Line Based On The Nodes' Positions
  if (childTopAnchorX > parentBottomAnchorX) {
    direction = "right";
  }
  if (childTopAnchorX < parentBottomAnchorX) {
    direction = "left";
  }
  if (childTopAnchorX === parentBottomAnchorX) {
    direction = "straight";
  }

  // Render The Correct Line Based On The Direction
  let doesHaveDirection = direction ? true : false;
  if (childNode.empty === true) {
    return null;
  }

  return (
    <div>
      {!doesHaveDirection ? null : direction === "right" ? (
        <RightEdge
          x1={parentRightAnchorX}
          y1={parentRightAnchorY}
          x2={childTopAnchorX}
          y2={childTopAnchorY}
          percentage={percentage}
          placeholder={isPlaceholder}
          percentageModalHandler={percentageModalHandler}
          parentId={parentNode.stepId}
          childId={childNode.stepId}
        />
      ) : direction === "left" ? (
        <LeftEdge
          x1={parentLeftAnchorX}
          y1={parentLeftAnchorY}
          x2={childTopAnchorX}
          y2={childTopAnchorY}
          percentage={percentage}
          placeholder={isPlaceholder}
          percentageModalHandler={percentageModalHandler}
          parentId={parentNode.stepId}
          childId={childNode.stepId}
        />
      ) : direction === "straight" ? (
        <StraightEdge
          x1={parentBottomAnchorX}
          y1={parentBottomAnchorY}
          x2={childTopAnchorX}
          y2={childTopAnchorY}
          percentage={percentage}
          placeholder={isPlaceholder}
          percentageModalHandler={percentageModalHandler}
          parentId={parentNode.stepId}
          childId={childNode.stepId}
        />
      ) : null}
    </div>
  );
};
