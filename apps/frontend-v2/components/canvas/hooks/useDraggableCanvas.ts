import { useGesture } from "@use-gesture/react";
import { useMemo, useState } from "react";

/**
 * A hook extracting the logic of the draggability, zooming-ability, and wheel-ability of the canvas
 *
 * @param canvasRef - the ref object of the inner canvas that should be moved
 *
 * @param parentRef - the ref object of the canvas' parent
 *
 * @param limits - Optional, limits for the zoom (min & max)
 * @default min: 1, max: 1.5
 *
 * @param setters - Optional, setters for the zoom & position, if needed (other than the reguler state
 * for tracking the scale). An example of why this may be wanted is for example, setting the sizing of nodes
 * based on the zoom level (regardless or in regard to limits, depending on your desired configuration)
 *
 * @returns styling - the styling to apply to the canvas (translate & scale)
 * @returns interactivity variable to spread into element
 */
export const useDraggableCanvas = (
  canvasRef: HTMLDivElement,
  parentRef: HTMLDivElement,
  setters?: {
    zoom?: (zoom: number) => void;
    position?: (position: { x: number; y: number }) => void;
  },
  limits: {
    zoom: {
      min: { value: number; continue: boolean };
      max: { value: number; continue: boolean };
    };
  } = {
    zoom: {
      min: { value: 0.99, continue: true },
      max: { value: 1.501, continue: true },
    },
  }
) => {
  // State for the dragging
  const [{ x, y, zoom }, setPositioning] = useState({ x: 0, y: 0, zoom: 1 });

  // Memoized value for the limitations on X and Y when moving
  const { xLimit, yLimit } = useMemo(() => {
    if (!canvasRef || !parentRef) return { xLimit: 0, yLimit: 0 };
    const canvasRects = canvasRef.getBoundingClientRect();
    const parentRects = parentRef.getBoundingClientRect();
    const limits = {
      xLimit: (canvasRects.width / zoom - parentRects.width) / 2,
      yLimit: canvasRects.height / zoom - parentRects.height,
    };

    return limits;
  }, [canvasRef, parentRef, zoom]);

  // The useGessture interactivty variable, spread into the element
  const interactivity = useGesture(
    {
      onDrag: (state) =>
        handleDrag({ deltaX: state.delta[0], deltaY: state.delta[1] }),
      onWheel: (state) => handleWheel(state.event),
      onPinch: (state) => handleZoom(state.offset),
    },
    {
      wheel: {
        preventDefault: true,
        pointer: { touch: true },
        eventOptions: { passive: false },
      },
      drag: {
        preventDefault: true,
        preventScroll: true,
        pointer: { touch: true },
        eventOptions: { passive: false },
      },

      pinch: {
        preventDefault: true,
        pointer: { touch: true },
        eventOptions: { passive: false },
        scaleBounds: { min: limits.zoom.min.value, max: limits.zoom.max.value },
      },
    }
  );

  // Handle wheeling
  const handleWheel = (e: { deltaY: number; deltaX: number }) => {
    const requestedX = x - e.deltaX;
    const requestedY = y - e.deltaY;

    const desiredX =
      requestedX > xLimit
        ? xLimit
        : requestedX < -xLimit
        ? -xLimit
        : requestedX;
    const desiredY =
      requestedY > 0
        ? 0
        : requestedY > yLimit
        ? yLimit
        : requestedY < -yLimit
        ? -yLimit
        : requestedY;

    console.log(
      "DesiredX & DesiredY: ",
      desiredX,
      desiredY,
      "RequestX & RequestY:",
      requestedX,
      requestedY
    );
    setPositioning((prev: any) => ({
      ...prev,
      x: desiredX,
      y: desiredY,
    }));
  };

  // Handle dragging
  const handleDrag = (e: { deltaY: number; deltaX: number }) => {
    const requestedX = x + e.deltaX;
    const requestedY = y + e.deltaY;

    const desiredX =
      requestedX > xLimit
        ? xLimit
        : requestedX < -xLimit
        ? -xLimit
        : requestedX;
    const desiredY =
      requestedY > 0
        ? 0
        : requestedY > yLimit
        ? yLimit
        : requestedY < -yLimit
        ? -yLimit
        : requestedY;

    setPositioning((prev: any) => ({
      ...prev,
      x: desiredX,
      y: desiredY,
    }));
  };

  // Handle zooming
  const handleZoom = (offset: [number, number]) => {
    console.log("Handling zoom", offset[0]);
    setters?.zoom?.(offset[0]);
    if (offset[0] < limits.zoom.max.value && offset[0] > limits.zoom.min.value)
      setPositioning((prev) => ({
        ...prev,
        zoom: offset[0],
      }));
  };

  // Handle manual movement (used by child focus)
  const handleAbsoluteMovement = (e: { deltaY: number; deltaX: number }) => {
    const requestedX = -e.deltaX;
    const requestedY = -e.deltaY;

    const desiredX =
      requestedX > xLimit
        ? xLimit
        : requestedX < -xLimit
        ? -xLimit
        : requestedX;
    const desiredY =
      requestedY > 0
        ? 0
        : requestedY > yLimit
        ? yLimit
        : requestedY < -yLimit
        ? -yLimit
        : requestedY;

    setPositioning((prev: any) => ({
      ...prev,
      x: desiredX,
      y: desiredY,
    }));
  };

  // Handle child click ("Focus")
  // (Scrolls to best position to center the child)
  const handleChildFocus = (childRef: HTMLDivElement | null) => {
    // Make sure both are defined
    if (!canvasRef || !childRef) return;

    // Get the rects of the node
    const nodeRect = childRef.getBoundingClientRect();
    const nodeLeft = parseInt(childRef.style.left);
    const nodeTop = parseInt(childRef.style.top);

    // Calculate the ABSOLUTE transfrom diff.
    const deltaX = nodeLeft + nodeRect.width / 2;
    const deltaY = nodeTop - nodeRect.height / 2;

    handleAbsoluteMovement({
      deltaY,
      deltaX,
    });
  };

  // Return interactvity variable and positioning
  return {
    interactivity,
    style: {
      transform: `translate(${x}px, ${y}px) `,
      scale: zoom,
    },
    handleChildFocus,
    setPositioning
  };
};
