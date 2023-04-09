import { BaseComponentProps } from "components/types";
import { CSSProperties, ForwardedRef, ReactElement } from "react";

/**
 * CanvasProps
 * @param setters - Optional, an object of setters for the position & zoom propreties of the canvas - When these change, the setters are invoked.
 * @param size - Optional, the size of the canvas. Defaults to flex-like sizing, with min dimensions of it's parent container
 * @param childrenWrapper - Optional, a wrapper element for the children. This is set as a seperate prop since we want the canvas
 * to have direct access to it's child nodes in order for it to have all of it's features
 */
export interface CanvasProps extends BaseComponentProps {
  setters?: {
    zoom?: (zoom: number) => void;
    position?: (position: { x: number; y: number }) => void;
  };
  size?: [number, number]; // x, y
  childrenWrapper?: ReactElement<any, any>;
  utilityButtons?: {
    children: React.ReactNode;
    label: React.ReactNode;
    onClick: () => void;
  }[];
  parentStyle?: CSSProperties
}
export interface DraggableCanvasProps extends CanvasProps {
  parentRef: ForwardedRef<HTMLDivElement>;
  setters?: {
    zoom?: (zoom: number) => void;
    position?: (position: { x: number; y: number }) => void;
  };
  size?: [number, number]; // x, y
  childrenWrapper?: ReactElement<any, any>;
}
