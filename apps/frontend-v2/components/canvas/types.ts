import { BaseComponentProps } from "components/types";
import { ForwardedRef } from "react";

/**
 * CanvasProps
 * @param setters - Optional, an object of setters for the position & zoom propreties of the canvas - When these change, the setters are invoked.
 * @param size - Optional, the size of the canvas. Defaults to flex-like sizing, with min dimensions of it's parent container
 */
export interface CanvasProps extends BaseComponentProps {
  setters?: {
    zoom?: (zoom: number) => void;
    position?: (position: { x: number; y: number }) => void;
  };
  size?: [number, number]; // x, y
}
export interface DraggableCanvasProps extends BaseComponentProps {
  parentRef: ForwardedRef<HTMLDivElement>;
  setters?: {
    zoom?: (zoom: number) => void;
    position?: (position: { x: number; y: number }) => void;
  };
  size?: [number, number]; // x, y
}
