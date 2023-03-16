import { useEffect, useState } from "react";

export const useTheme = () => {
  const [theme, setTheme] = useState<Themes>(Themes.DARK);

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  return { theme, setTheme };
};

export enum Themes {
  DARK = "dark",
  LIGHT = "light",
}
