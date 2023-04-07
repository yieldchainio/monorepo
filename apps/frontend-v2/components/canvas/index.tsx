/**
 * A draggable canvas component (Used for displaying steps/steps building)
 */

import { BaseComponentProps } from "components/types";
import { CanvasProps, DraggableCanvasProps } from "./types";
import { forwardRef, isValidElement, useRef, useState } from "react";

import { useDraggableCanvas } from "./hooks/useDraggableCanvas";
import { ChildrenProvider } from "components/internal/render-children";

export const Canvas = ({ children, setters }: CanvasProps) => {
  // Saving refs for both the parent container & the canvas
  const parentRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Return the component JSX
  return (
    <ParentContainer ref={parentRef}>
      <DraggableCanvas parentRef={parentRef} ref={canvasRef} setters={setters}>
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
        className="w-full h-full border-[2px] border-lime-500 flex flex-col items-center justify-center overflow-hidden "
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
  ({ children, parentRef, setters }: DraggableCanvasProps, ref) => {
    // Use the useDraggableCanvas hook to get the styling and ref to spread
    const { interactivity, style } = useDraggableCanvas(
      // @ts-ignore
      ref.current as unknown as HTMLDivElement,
      // @ts-ignore
      parentRef.current as unknown as HTMLDivElement,
      {
        zoom: (_zoom: number) => {
          console.log(
            "Setting Dummy Zoom to:",
            _zoom < 1 ? 0.99 : _zoom > 1.5 ? 1.501 : _zoom
          );
          setZoom(_zoom < 1 ? 0.99 : _zoom > 1.5 ? 1.501 : _zoom);
        },
      }
    );

    const [zoom, setZoom] = useState(1);

    return (
      <div
        className="min-w-full min-h-full  bg-custom-bcomponentbg w-[150vw] h-[calc(max-content+300px)] bg-dotted-spacing-6 bg-dotted-custom-border cursor-grab active:cursor-grabbing flex flex-row items-center justify-center  touch-pinch-zoom  "
        style={{ ...style }}
        ref={ref}
        {...interactivity()}
      >
        {children}
      </div>
    );
  }
);
