/**
 * A draggable canvas component (Used for displaying steps/steps building)
 */

import { BaseComponentProps } from "components/types";
import { CanvasProps, DraggableCanvasProps } from "./types";
import {
  MouseEvent,
  forwardRef,
  isValidElement,
  useRef,
  useState,
} from "react";

import { useDraggableCanvas } from "./hooks/useDraggableCanvas";
import { ChildrenProvider } from "components/internal/render-children";
import { animated } from "react-spring";
import { RegulerButton } from "components/buttons/reguler";
import WrappedImage from "components/wrappers/image";

export const Canvas = ({
  children,
  setters,
  size,
  childrenWrapper = <></>,
}: CanvasProps) => {
  // Saving refs for both the parent container & the canvas
  const parentRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Return the component JSX
  return (
    <ParentContainer ref={parentRef}>
      <DraggableCanvas
        parentRef={parentRef}
        ref={canvasRef}
        setters={setters}
        size={size}
        childrenWrapper={childrenWrapper}
      >
        {children}
      </DraggableCanvas>
    </ParentContainer>
  );
};

// =============================
//      INTERNAL COMPONENTS
// =============================

/**
 * The parent container - adapts to parent dimensions, overflow is hidden
 * @notice forwardRef is used since we would want to access the container's dimensions
 * when constraining drag positions
 */
const ParentContainer = forwardRef<HTMLDivElement, BaseComponentProps>(
  ({ children }: BaseComponentProps, ref) => {
    return (
      <div
        className="relative w-full h-full  flex flex-col items-center justify-start overflow-hidden rounded-xl border-[2px] border-custom-border "
        ref={ref}
      >
        {children}
      </div>
    );
  }
);

/**
 * The actual draggable canvas.
 */

const DraggableCanvas = forwardRef<HTMLDivElement, DraggableCanvasProps>(
  (
    {
      children,
      parentRef,
      setters,
      size,
      childrenWrapper,
    }: DraggableCanvasProps,
    ref
  ) => {
    // Use the useDraggableCanvas hook to get the styling and ref to spread
    const { interactivity, style, handleChildFocus, setPositioning } =
      useDraggableCanvas(
        // @ts-ignore
        ref.current as unknown as HTMLDivElement,
        // @ts-ignore
        parentRef.current as unknown as HTMLDivElement,
        {
          zoom: (_zoom: number) => {
            setZoom(_zoom < 1 ? 0.99 : _zoom > 1.5 ? 1.501 : _zoom);
          },
        }
      );

    const [zoom, setZoom] = useState(1);

    // We set a ref for all of our child nodes (To focus onClick, mainly.)
    const childRefs: Map<number, HTMLDivElement> = useRef(new Map()).current;

    return (
      <>
        <div
          className="min-w-[150%] min-h-[150%] bg-custom-darkSubbg h-max bg-dotted-spacing-6 bg-dotted-custom-border cursor-grab active:cursor-grabbing flex flex-row items-start justify-center  touch-pinch-zoom py-10 "
          style={{
            ...style,
            width: !size ? undefined : `${size[0] * 5}px`,
            height: !size ? undefined : `${size[1] * 5}px`,
          }}
          ref={ref}
          {...interactivity()}
        >
          <ChildrenProvider
            callback={(wrapper) => {
              if (!isValidElement(wrapper)) return wrapper;

              return (
                <wrapper.type {...wrapper.props}>
                  {" "}
                  <ChildrenProvider
                    callback={(child, i) => {
                      // Typecheck
                      if (!isValidElement(child)) return child;

                      // If it is valid, we return it but set it to trigger our focus function onClick, which will transform the canvas onto its
                      // own position to center it. we also give it a ref for the above to be feasiable
                      return (
                        <child.type
                          {...child.props}
                          ref={(node: any) => {
                            !node
                              ? childRefs.delete(i)
                              : childRefs.set(i, child.props.ref || node);

                            // console.log("Ref of this child", childRefs.get(i));
                          }}
                          onClick={(
                            e: MouseEvent<HTMLDivElement, MouseEvent>
                          ) => {
                            // Invoke existing onCLick if needed, we do not want to override that behavior
                            child.props.onClick?.(e);

                            // Add our focus function
                            handleChildFocus(childRefs.get(i) || null);
                          }}
                        ></child.type>
                      );
                    }}
                  >
                    {children}
                  </ChildrenProvider>
                </wrapper.type>
              );
            }}
          >
            {childrenWrapper}
          </ChildrenProvider>
        </div>
        {/* <div className=""></div> */}
        <div className="absolute w-[100%] h-[50px]  z-1000 flex flex-row justify-end items-center pr-4 ">
          <RegulerButton
            style={{
              paddingLeft: "6px",
              paddingRight: "6px",
              paddingTop: "6px",
              paddingBottom: "5px",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => {
              setPositioning({ x: 0, y: 0, zoom: 1 });
            }}
          >
            <WrappedImage
              src={{
                dark: "/icons/center-light.svg",
                light: "/icons/center-dark.svg",
              }}
              width={14}
              height={14}
            />
          </RegulerButton>
        </div>
      </>
    );
  }
);