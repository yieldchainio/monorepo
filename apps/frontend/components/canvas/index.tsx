/**
 * A draggable canvas component (Used for displaying steps/steps building)
 */

import { BaseComponentProps } from "components/types";
import { CanvasProps, DraggableCanvasProps } from "./types";
import React, {
  MouseEvent,
  forwardRef,
  isValidElement,
  useMemo,
  useRef,
  useState,
} from "react";

import { useDraggableCanvas } from "./hooks/useDraggableCanvas";
import { ChildrenProvider } from "components/internal/render-children";
import { RegulerButton } from "components/buttons/reguler";
import WrappedImage from "components/wrappers/image";
import { InfoProvider } from "components/info-providers";

export const Canvas = ({
  children,
  setters,
  size,
  childrenWrapper = <></>,
  style,
  parentStyle,
  utilityButtons,
  id,
}: CanvasProps) => {
  // Saving refs for both the parent container & the canvas
  const parentRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Return the component JSX
  return (
    <ParentContainer ref={parentRef} style={parentStyle}>
      <DraggableCanvas
        parentRef={parentRef}
        ref={canvasRef}
        setters={setters}
        size={size}
        childrenWrapper={childrenWrapper}
        style={style}
        utilityButtons={utilityButtons}
        id={id}
      >
        {children}
      </DraggableCanvas>
    </ParentContainer>
  );
};

Canvas.displayName = "Canvas";

// =============================
//      INTERNAL COMPONENTS
// =============================

/**
 * The parent container - adapts to parent dimensions, overflow is hidden
 * @notice forwardRef is used since we would want to access the container's dimensions
 * when constraining drag positions
 */
const ParentContainer = forwardRef<HTMLDivElement, BaseComponentProps>(
  ({ children, style }: BaseComponentProps, ref) => {
    return (
      <div
        className="relative flex flex-col items-center justify-start overflow-hidden rounded-xl border-[0px] border-custom-border "
        ref={ref}
        style={style}
      >
        {children}
      </div>
    );
  }
);

ParentContainer.displayName = "ParentContainer";

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
      utilityButtons,
      style: propStyle,
      id,
    }: DraggableCanvasProps,
    ref
  ) => {
    // Use the useDraggableCanvas hook to get the styling and ref to spread
    const {
      interactivity,
      style,
      handleChildFocus,
      handleAbsoluteMovement,
      setPositioning,
    } = useDraggableCanvas(
      // @ts-ignore
      ref.current as unknown as HTMLDivElement,
      // @ts-ignore
      parentRef.current as unknown as HTMLDivElement,
      {
        zoom: (_zoom: number) => {
          setZoom(_zoom < 1 ? 0.99 : _zoom > 1.5 ? 1.501 : _zoom);
          setters?.zoom?.(_zoom);
        },
      },
      {
        zoom: {
          min: { value: 0.99, continue: true },
          max: { value: 1.501, continue: true },
          default: { value: 1, continue: true },
        },
        dependencies: [size?.[0], size?.[1]],
      }
    );

    const [zoom, setZoom] = useState(1);

    // We set a ref for all of our child nodes (To focus onClick, mainly.)
    const childRefs: Map<number, HTMLDivElement> = useRef(new Map()).current;

    // Memoize width and height
    const width = useMemo(() => size?.[0], [size?.[0]]);
    const height = useMemo(() => size?.[1], [size?.[1]]);

    return (
      <>
        <div
          className="absolute min-w-[150%] min-h-[150%] bg-custom-darkSubbg bg-dotted-spacing-6 bg-dotted-custom-border cursor-grab active:cursor-grabbing flex flex-row items-start justify-center  touch-pinch-zoom py-10  "
          {...interactivity()}
          style={{
            ...style,
            ...propStyle,
            width: `${width}px`,
            height: `${height}px`,
          }}
          ref={ref}
          id={id}
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
                      if (
                        !isValidElement(child) ||
                        child.type == React.Fragment
                      )
                        return child;

                      // If it is valid, we return it but set it to trigger our focus function onClick, which will transform the canvas onto its
                      // own position to center it. we also give it a ref for the above to be feasiable
                      return (
                        <child.type
                          {...child.props}
                          ref={(node: any) => {
                            !node
                              ? childRefs.delete(i)
                              : childRefs.set(i, child.props.ref || node);
                          }}
                          onClick={(
                            e: MouseEvent<HTMLDivElement, MouseEvent>
                          ) => {
                            // Invoke existing onCLick if needed, we do not want to override that behavior
                            child.props.onClick?.(e);

                            // Add our focus function
                            handleChildFocus(childRefs.get(i) || null, i);
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
        <div className="absolute w-max left-[100%] translate-x-[-100%] h-[50px]  z-10000000000000000 flex flex-row justify-end items-center pr-4 gap-2">
          {(utilityButtons || [])
            .concat([
              {
                onClick: () => {
                  handleAbsoluteMovement({ deltaX: 0, deltaY: 0, zoom: 1 });
                },
                children: (
                  <WrappedImage
                    src={{
                      dark: "/icons/center-light.svg",
                      light: "/icons/center-dark.svg",
                    }}
                    width={14}
                    height={14}
                  />
                ),
                label: "Center View",
              },
            ])
            .map((utilButton, i) => {
              return (
                <InfoProvider contents={utilButton.label} key={`${i}`}>
                  <RegulerButton
                    style={{
                      paddingLeft: "6px",
                      paddingRight: "6px",
                      paddingTop: "6px",
                      paddingBottom: "5px",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onClick={utilButton.onClick}
                  >
                    {utilButton.children}
                  </RegulerButton>
                </InfoProvider>
              );
            })}
        </div>
      </>
    );
  }
);
DraggableCanvas.displayName = "DraggableCanvas";
