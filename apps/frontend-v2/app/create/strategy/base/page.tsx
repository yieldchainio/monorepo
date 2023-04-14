"use client";
/**
 * Base steps config for the strategy
 */

import { useBackdropColorChange } from "utilities/hooks/general/useBackdropColorChange";

const BaseStepsConfig = () => {
  // Set the colors
  useBackdropColorChange("#c44", "#4ea");
  return <div></div>;
};

export default BaseStepsConfig;
