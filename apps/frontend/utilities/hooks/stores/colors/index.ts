/**
 * A hook to control the colors of the strategy config page
 */

import { create } from "zustand";
import { StrategyConfigColorsStore } from "./types";

export const useStrategyConfigColors = create<StrategyConfigColorsStore>(
  (set, get) => ({
    top: "#44F",
    bottom: "#3EEB",
    setColors: (top: string, bottom: string) =>
      set((state) => ({
        top,
        bottom,
      })),
  })
);
