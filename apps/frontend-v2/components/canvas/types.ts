import { BaseComponentProps } from "components/types";
import { ForwardedRef } from "react";

export interface CanvasProps extends BaseComponentProps {
  setters?: {
    zoom?: (zoom: number) => void;
    position?: (position: { x: number; y: number }) => void;
  };
}
export interface DraggableCanvasProps extends BaseComponentProps {
  parentRef: ForwardedRef<HTMLDivElement>;
  setters?: {
    zoom?: (zoom: number) => void;
    position?: (position: { x: number; y: number }) => void;
  };
}
