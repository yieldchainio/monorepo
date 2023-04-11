/**
 * Change the colors on visit of a config
 */

import { useEffect } from "react";
import { useStrategyConfigColors } from "utilities/hooks/stores/colors";

export const useBackdropColorChange = (top: string, bottom: string) => {
  const setColors = useStrategyConfigColors((state) => state.setColors);
  useEffect(() => {
    setColors(top, bottom);
  }, []);
};
