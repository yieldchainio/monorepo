/**
 * Disable scroll on mount and reenable on unmount
 */

import { useEffect } from "react";

export const useDisableScroll = () => {
  // UseEffect
  useEffect(() => {
    // What it was previously
    const pre = document.documentElement.style.overflow;

    // Set it to hidden on mount
    document.documentElement.style.overflow = "hidden";

    // on unmount, revert
    return () => {
      document.documentElement.style.overflow = pre;
    };
  }, []);
};
