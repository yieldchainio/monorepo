import { create } from "zustand";

/**
 * @notice
 * @hook useTheme()
 * used to store whether the user wants a dark or light theme
 */

// Types of themes
export enum ThemeTypes {
  DARK = "dark",
  LIGHT = "light",
}

// The interface for this store
export interface ThemeStore {
  theme: ThemeTypes;
  setTheme: (theme: ThemeTypes) => any;
}

// The actual store hook
export const useTheme = create<ThemeStore>((set) => ({
  theme: ThemeTypes.DARK,
  setTheme: (_theme: ThemeTypes) =>
    set((state) => {
      return {
        theme: _theme,
      };
    }),
}));
