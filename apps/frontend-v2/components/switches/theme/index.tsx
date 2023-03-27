import { Switch } from "components/switches/base";
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

  // Have a useEffect to listen to the theme changing, and change the boolean
  // state accordingly
  useEffect(() => {
    setBooleanState(theme === Themes.LIGHT ? true : false);
  }, [theme]);

  // Handle the click - set the theme and also our boolean state
  const handleClick = (on: boolean) => {
    setTheme(on ? Themes.LIGHT : Themes.DARK);
    setBooleanState(on);
  };

  // Return the switch component with the overriding state
  return (
    <Switch
      handler={handleClick}
      images={{
        offImage: "/icons/moon.svg",
        onImage: "/icons/sun.svg",
      }}
      overridingState={booleanState}
    />
  );
};
