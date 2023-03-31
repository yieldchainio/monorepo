/**
 * The base tooltop "Info provider" component
 */

import { BaseComponentProps } from "components/types";
import WrappedText from "components/wrappers/text";
import { dir } from "console";
import {
  Children,
  cloneElement,
  createRef,
  isValidElement,
  MouseEvent,
  MouseEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal, findDOMNode } from "react-dom";

enum ToolTipDirection {
  LEFT = 0,
  BELOW = 1,
  ABOVE = 2,
  RIGHT = 3,
}
interface InfoProviderProps extends BaseComponentProps {
  contents: React.ReactNode;
  direction: ToolTipDirection;
}
export const InfoProvider = ({
  children: consumers,
  className,
  contents: children,
}: InfoProviderProps) => {
  // We set a ref for all of our consumers ( The elements which we wrap around and trigger on hover )
  const setRefs = useRef(new Map()).current;

  // The current active, hovered on consumer
  const [activeConsumerIndex, setActiveConsumerIndex] = useState<number | null>(
    null
  );

  // The state that triggers visiblity & positioning
  const [visible, setVisible] = useState<
    { x: number; y: number; width: number; height: number } | false
  >(false);

  useEffect(() => {
    // We set visiblity to false if active index is null
    if (activeConsumerIndex == null) {
      setVisible(false);
      return;
    }
    // Get the ref of the consumer
    const consumer = setRefs.get(activeConsumerIndex);

    // If not correct index, set visiblity to false
    if (!consumer) {
      console.log(
        "Consumer Non Accessible - Consumer:",
        consumer,
        "refs:",
        setRefs
      );
      setVisible(false);
      return;
    }

    // Get its rects
    console.log(
      "Gonna get recs for this consumer with this index:",
      activeConsumerIndex,
      consumer
    );
    const rects = consumer.getBoundingClientRect();

    // Sufficient check
    if (!rects) throw new Error("Tooltip Error: Rects Are Undefined!");

    // Set the X and Y positions
    console.log("Consumer rracts", rects);
    setVisible({
      x: rects.left,
      y: rects.top,
      width: rects.width,
      height: rects.height,
    });
  }, [activeConsumerIndex]);

  const toolTipRef = useRef<HTMLDivElement>(null);

  const [shouldClose, setShouldClose] = useState<boolean>(true);

  // Handle hover over the children
  const handleHover = (
    consumerIndex: number | null,
    close: boolean = false
  ) => {
    if (consumerIndex !== null) {
      console.log("Consumer index isnt null");
      setActiveConsumerIndex(consumerIndex);
      setShouldClose(close);
    } else {
      console.log("Inputted consumer index is null");
    }
  };

  // Handle closing the children
  const handleClose = async () => {
    setShouldClose(true);

    // Set "Should close to true" before awaiting the delay
    await new Promise((res, rej) =>
      setTimeout(() => {
        res(true);
      }, 100)
    );

    console.log("Awaited delay", shouldClose);

    // If shouldClose is true, set active consumer index to null (closes the tooltip).
    // Note that whilst we are awaiting the delay, shouldClose may be set to false
    // by another function (e.g the tooltip being hovered over), in which case we will not
    // set the active consumer index to null
    shouldClose ? setActiveConsumerIndex(null) : null;
  };

  return (
    <>
      {visible &&
        createPortal(
          <div
            ref={toolTipRef}
            className={
              "flex flex-col bg-custom-componentbg shadow-md absolute p-2 z-[100000] w-max h-max rounded-xl animate-toolTip " +
              " " +
              className
            }
            style={{
              left: `${visible.x + visible.width / 2}px`,
              top: `${visible.y + window.scrollY - visible.height}px`,
              transform: "translate(-50%, -50%)",
            }}
            id="Tooltip"
            onMouseEnter={(e) => handleHover(activeConsumerIndex)}
            onMouseLeave={(e) => handleClose()}
          >
            {Children.map(children, (child) => {
              if (isValidElement(child)) {
                // if we got a string we return a wrapped text version of it
                if (typeof child === "string")
                  return (
                    <WrappedText
                      style={{
                        fontSize: "4px",
                      }}
                      fontStyle="bold"
                    >
                      {child}
                    </WrappedText>
                  );
              }
              return child;
            })}
          </div>,
          document.body
        )}
      {Children.map(consumers, (consumer, i) => {
        // Typecheck
        if (!isValidElement(consumer)) return consumer;

        // If it is valid, we return it but set it to trigger our state on hover,
        // we also give it a ref
        return (
          <consumer.type
            {...consumer.props}
            ref={(node: any) => {
              !node ? setRefs.delete(i) : setRefs.set(i, node);
            }}
            onMouseEnter={async (e: MouseEvent<HTMLDivElement, MouseEvent>) => {
              e.stopPropagation();
              handleHover(i, true);
            }}
            onMouseLeave={async (e: any) => {
              e.stopPropagation();
              setShouldClose(true);
              console.log("Gonna close the tooltip, shouldClose:", shouldClose);
              await handleClose();
            }}
          ></consumer.type>
        );
      })}
    </>
  );
};

/**
 * A helper to get the positioning of the tooltip
 */

type rects = { width: number; height: number; left: number; top: number };
const calcPosition = (
  direction: ToolTipDirection,
  childRects: rects
): {
  top: number;
  left: number;
  transform: string;
} => {
  // The base positioning
  const returnObj = {
    left: childRects.left,
    top: childRects.top,
    transform: "translate(",
  };

  /**
   * A switch case for the directions, adding/substracting corresponding positions for the tooltip
   */

  // If its to the left or right, do the followi g
  if (direction === 0 || 3) {
    // If its left, move it to the left by the its own (tooltip) width + margin
    if (direction == 0) returnObj.transform += "-150%";
    // If its right, move it to the right by the child's width + margin
    else {
      returnObj.left += childRects.width;
      returnObj.transform += "+50%";
    }
    // For both, move them downwards by half of the child's width
    returnObj.top += childRects.height / 2;

    // For both, transform 50% to the top
    returnObj.transform += "-50%)";
    return returnObj;
  }

  // Both top and bottom need the following left position
  returnObj.left += childRects.width / 2;
  returnObj.transform += "-50%,";

  // If its top, add this transform to move it to the top by its own height + margin
  if (direction === 2) {
    returnObj.transform += "-150%)";
    return returnObj;
  }

  // If its bottom, add the child's height to top position + 50% y tra nsformation
  returnObj.top += childRects.height;
  returnObj.transform += "+50%)";
  return returnObj;
};
