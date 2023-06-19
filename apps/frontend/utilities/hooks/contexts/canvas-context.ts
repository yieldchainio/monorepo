import { createContext, useContext } from "react";
import { useElementPortal } from "../general/useElementPortal";

export const CanvasContext = createContext<string>("");

export const useCanvasPortal = () => {
  const canvasContext: string = useContext(CanvasContext);

  const portal = useElementPortal(canvasContext);

  return portal;
};
