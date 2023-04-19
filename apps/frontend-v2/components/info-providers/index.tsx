/**
 * The base tooltop "Info provider" component
 */
import {
  Children,
  isValidElement,
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { InfoProviderProps, ToolTipDirection } from "./types";
import { applyTriggerArgs, positionTooltip } from "./utils";
import { ChildrenProvider } from "components/internal/render-children";

("bg-custom-bcomponentbg");
/**
 * Mapping directions to corresponding animation strings
 */
export const TOOLTIP_ANIMATION: {
  [key in ToolTipDirection]: string;
} = {
  [ToolTipDirection.LEFT]: "animate-toolTipLeft",
  [ToolTipDirection.RIGHT]: "animate-toolTipRight",
  [ToolTipDirection.TOP]: "animate-toolTipTop",
  [ToolTipDirection.BOTTOM]: "animate-toolTipBottom",
};

/**
 * A generic "Info" provider (AKA a Tooltip)
 * @param children - The children which we wrap around and provide the info to on hover
 * @param className - base props proprety, for styling
 * @param contents - The tooltip's actual children, what it displays within it (the "Info")
 */
export const InfoProvider = ({
  handleCustomClose,
  handleCustomOpen,
  children: consumers,
  className,
  contents: children,
  direction = ToolTipDirection.TOP,
  visibilityOverride = false,
  style,
  delay,
  trigger = "onHover",
  overrideDefaultComponent = false,
  setCloseHandler,
  portal,
}: InfoProviderProps) => {
  // We set a ref for all of our consumers ( The elements which we wrap around and trigger on hover )
  const setRefs = useRef<Map<number, HTMLDivElement>>(new Map()).current;

  // The current active, hovered on consumer
  const [activeConsumerIndex, setActiveConsumerIndex] = useState<number | null>(
    null
  );

  // The state that triggers visiblity & positioning
  const [visible, setVisible] = useState<
    Omit<DOMRect, "bottom" | "right" | "toJSON"> | false
  >(false);

  // a useEffect to set our state to visible (On the FIRST child),
  // if we got a visibillity override prop
  useEffect(() => {
    if (visibilityOverride == true) setActiveConsumerIndex(0);
    else setActiveConsumerIndex(null);
  }, [visibilityOverride]);

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
      setVisible(false);
      return;
    }

    // get it's rects
    const rects = consumer.getBoundingClientRect();

    const portalRects = portal
      ? portal.getBoundingClientRect()
      : {
          width: 0,
          height: 0,
          left: 0,
          top: 0,
          x: 0,
          y: 0,
        };

    // Sufficient check
    if (!rects) throw new Error("Tooltip Error: Rects Are Undefined!");

    // Get the computed style of the portal, if available
    const computedStyle = portal
      ? window.getComputedStyle(portal)
      : { getPropertyValue: (args: string) => "1" };

    // Retreive the portal's scale proprety, parseFloat it
    const portalScale =
      parseFloat(computedStyle.getPropertyValue("scale")) || 1;

    // Calculate the X and Y offsets by subtracting the portal's coordinates
    // from the child's, to ensure they fit exaclty within the portal (or the viewport),
    // if no portal was provided.
    // Also, divide the result by the portal's scale. This is done to ensure
    // it does not mess up the positioning
    const offsetX = (rects.left - portalRects.left) / portalScale;
    const offsetY = (rects.top - portalRects.top) / portalScale;

    // Set the X and Y positions
    setVisible({
      width: rects.width,
      height: rects.height,
      left: offsetX,
      top: offsetY,
      x: offsetX,
      y: offsetY,
    });
  }, [activeConsumerIndex]);

  // Handle hover over the children
  const handleTrigger = async (
    consumerIndex: number | null,
    close: boolean = false
  ) => {
    // If we got a trigger and our inputted consumer index is not nullish
    if (consumerIndex !== null) {
      // If we got a custom open handler, invoke that
      if (handleCustomOpen) handleCustomOpen();

      // If we got a delay, await it first
      if (delay)
        await new Promise((res, rej) =>
          setTimeout(() => {
            res(true);
          }, delay)
        );

      // Set the active consumer index to our inputted index
      setActiveConsumerIndex(consumerIndex);
    }
  };

  // Handle closing the children
  const handleClose = async () => {
    // If we got a custom close handler, invoke that
    if (handleCustomClose) handleCustomClose();

    // Await a delay if we got one
    if (delay)
      await new Promise((res, rej) =>
        setTimeout(() => {
          res(true);
        }, delay)
      );

    // Set the active consumer index to null
    setActiveConsumerIndex(null);
  };

  // Set the close handler using the optionallu provided prop (used for dropdowns and such)
  useEffect(() => {
    if (setCloseHandler) setCloseHandler(() => handleClose);
  }, []);

  // Mapping triggers to their corresponding props that we should spread
  const triggers = useMemo(() => {
    return {
      onClick: {
        onClick: (
          e: MouseEvent<HTMLDivElement, MouseEvent>,
          i: number | null
        ) => {
          e.stopPropagation();
          if (visible) setActiveConsumerIndex(null);
          else handleTrigger(i, true);
        },
      },
      onHover: {
        onMouseEnter: async (
          e: MouseEvent<HTMLDivElement, MouseEvent>,
          i: number | null
        ) => {
          e.stopPropagation();
          handleTrigger(i, true);
        },
        onMouseLeave: async (e: any) => {
          e.stopPropagation();
          handleClose();
        },
      },
    };
  }, [visible, activeConsumerIndex]);

  return (
    <>
      {visible &&
        createPortal(
          <>
            {!overrideDefaultComponent ? (
              <div
                className={
                  "flex flex-col bg-custom-componentbg shadow-md absolute px-3 py-1.5 z-[100000] w-max h-max rounded-xl " +
                  TOOLTIP_ANIMATION[direction] +
                  " " +
                  className
                }
                style={{
                  ...positionTooltip(direction, visible),
                  ...(style || {}),
                }}
                id="Tooltip"
                {...applyTriggerArgs(
                  triggers[trigger],
                  activeConsumerIndex,
                  {}
                )}
              >
                <ChildrenProvider
                  textProps={{
                    style: {
                      fontSize: "12px",
                    },
                    fontStyle: "bold",
                  }}
                >
                  {children}
                </ChildrenProvider>
              </div>
            ) : (
              <ChildrenProvider>{children}</ChildrenProvider>
            )}
          </>,
          portal || document.body
        )}
      {Children.map(consumers, (consumer, i) => {
        // Typecheck
        if (!isValidElement(consumer)) return consumer;

        // If it is valid, we return it but set it to trigger our state on hover,
        // we also give it a ref
        return (
          <consumer.type
            {...consumer.props}
            ref={(node: HTMLDivElement) => {
              !node
                ? setRefs.delete(i)
                : setRefs.set(i, consumer.props.ref || node);
            }}
            {...applyTriggerArgs(triggers[trigger], i, consumer.props)}
          ></consumer.type>
        );
      })}
    </>
  );
};
