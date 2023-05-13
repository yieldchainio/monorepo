import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * @notice
 * @hook useTheme()
 * used to store whether the user wants a dark or light theme
 */

// Types of themes
export enum Themes {
  DARK = "dark",
  LIGHT = "light",
}

// The interface for this store
export interface ThemeStore {
  theme: Themes;
  setTheme: (theme: Themes) => any;
}

// The actual store hook
export const useTheme = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: Themes.DARK,
      setTheme: (_theme: Themes) =>
        set((state) => {
          document.documentElement.className = _theme;
          return {
            theme: _theme,
          };
        }),
    }),
    {
      name: "theme",
      // onRehydrateStorage: (state) => {
      //   state.setTheme(state.theme)
      //   console.log("Set THeme:", state.setTheme);
      // },
    }
  )
);
