import { RegulerButton } from "components/buttons/reguler";
import { Switch } from "components/switches/base";
import WrappedImage from "components/wrappers/image";
import { useEffect, useState } from "react";

import { useTheme, Themes } from "utilities/hooks/stores/theme";

/**
 * A switch compoennt for the theme, with shared state
 */
export const ThemeSwitch = () => {
  // Get the theme state
  const { theme, setTheme } = useTheme();

  // Keep track of the switch state manually,
  // using the theme state - override the reguler switch one.
  const [booleanState, setBooleanState] = useState<boolean>(
    theme === Themes.DARK ? false : true
  );

  // Keep track of the theme global state, change photo in that case
  const [themeImage, setThemeImage] = useState<string>(
    theme === Themes.DARK ? "/icons/moon.svg" : "/icons/sun.svg"
  );

  // Have a useEffect to listen to the theme changing, and change the boolean
  // state accordingly
  useEffect(() => {
    setThemeImage(theme == Themes.DARK ? "/icons/moon.svg" : "/icons/sun.svg");
  }, [theme]);

  // Handle the click - set the theme and also our boolean state
  const handleClick = (on: boolean) => {
    setTheme(on ? Themes.LIGHT : Themes.DARK);
    setBooleanState(on);
  };

  // Return the switch component with the overriding state
  return (
    <RegulerButton
      onClick={() => handleClick(theme === Themes.DARK ? true : false)}
      style={{
        paddingTop: "0.5rem",
        paddingBottom: "0.5rem",
        paddingLeft: "0.5rem",
        paddingRight: "0.5rem",
        // borderColor: "var(--themed-border)",
      }}
    >
      <WrappedImage src={themeImage} width={18} height={18} />
    </RegulerButton>
  );
};
