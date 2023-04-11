"use client";
import { useState } from "react";
import { useConfigRouting } from "utilities/hooks/general/useConfigRouting";
import { configRoutes } from "./constants";
/**
 * Main layout for the strategy config
 */

import { StrategyCreationLayoutProps } from "./types";
import { BackdropColor } from "components/backdrop-color";
import { useDisableScroll } from "utilities/hooks/styles/useDisableScroll";
import { Navigators } from "../../../components/navigators";
import { useStrategyConfigColors } from "utilities/hooks/stores/colors";

const StrategyConfigLayout = ({ children }: StrategyCreationLayoutProps) => {
  /**
   * Get the next and prev functions for our configs (Assinging to buttons)
   */
  const { next, prev } = useConfigRouting("/create/strategy", configRoutes);

  /**
   * State saying whether the user can continue onto the next config screen
   * (setter passed onto each config which can set this as they wish)
   *
   * if is true, can continue.
   * if is ReactNode, cannot continue - use ReactNode as explanation child in InfoProvider
   */
  const [canContinue, setCanContinue] = useState<true | React.ReactNode>(
    "Complete This Config To Continue!"
  );

  /**
   * Styling store, set the colors of the backdrops
   */
  const { top, bottom } = useStrategyConfigColors();

  // Disable scrolling on the config page
  useDisableScroll();

  // Return the component
  return (
    <div className="flex flex-col items-center justify-start bg-custom-bg w-[100vw] h-[100vh] overflow-hidden z-0 absolute pt-[20vh] pb-[20vh]">
      <BackdropColor
        color={top}
        style={{ zIndex: -1, top: "-20%", left: "80%", width: "50vw" }}
      />
      <BackdropColor
        color={bottom}
        style={{
          top: "75%",
          left: "-30%",
          width: "50vw",
          zIndex: -1,
        }}
      />

      <Navigators next={next} prev={prev} />
      {children}
    </div>
  );
};

export default StrategyConfigLayout;
