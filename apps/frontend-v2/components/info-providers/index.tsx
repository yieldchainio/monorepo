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
}: InfoProviderProps) => {
  // We set a ref for all of our consumers ( The elements which we wrap around and trigger on hover )
  const setRefs = useRef(new Map()).current;

  // The current active, hovered on consumer
  const [activeConsumerIndex, setActiveConsumerIndex] = useState<number | null>(
    null
  );

  // The state that triggers visiblity & positioning
  const [visible, setVisible] = useState<DOMRect | false>(false);

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

    // Sufficient check
    if (!rects) throw new Error("Tooltip Error: Rects Are Undefined!");

    // Set the X and Y positions
    setVisible(rects);
  }, [activeConsumerIndex]);

  // A state for whether a close operation shall complete itself
  const [shouldClose, setShouldClose] = useState<boolean>(true);

  // Handle hover over the children
  const handleTrigger = async (
    consumerIndex: number | null,
    close: boolean = false
  ) => {
    if (consumerIndex !== null && shouldClose !== false) {
      setShouldClose(close);

      console.log("JEUUUU");

      if (handleCustomOpen) {
        console.log("Handling open");
        handleCustomOpen();
      } else [console.log("Not open handler", handleCustomOpen)];
      if (delay)
        await new Promise((res, rej) =>
          setTimeout(() => {
            res(true);
          }, delay)
        );

      if (shouldClose === close) {
        setActiveConsumerIndex(consumerIndex);
      }

      await new Promise((res) => {
        setTimeout(() => res(true), 500);
        if (shouldClose !== close) setActiveConsumerIndex(null);
      });
    }
  };

  // Handle closing the children
  const handleClose = async () => {
    setShouldClose(true);

    if (handleCustomClose) handleCustomClose();

    // Set "Should close to true" before awaiting the delay
    await new Promise((res, rej) =>
      setTimeout(() => {
        res(true);
      }, delay)
    );

    // If shouldClose is true, set active consumer index to null (closes the tooltip).
    // Note that whilst we are awaiting the delay, shouldClose may be set to false
    // by another function (e.g the tooltip being hovered over), in which case we will not
    // set the active consumer index to null
    shouldClose ? setActiveConsumerIndex(null) : null;
  };

  useEffect(() => {
    if (setCloseHandler) setCloseHandler(() => handleClose);
  }, []);

  // Constants
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
                {...applyTriggerArgs(triggers[trigger], activeConsumerIndex, {})}
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
