/**
 * Disable scroll on mount and reenable on unmount
 */

import { useEffect } from "react";

export function useDisableScroll() {
  // UseEffect
  useEffect(() => {
    // What it was previously
    const pre = document.documentElement.style.overflow;
    const preOverscroll =
      document.documentElement.style.overscrollBehaviorBlock;

    // Set it to hidden on mount
    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.overscrollBehaviorBlock = "contain";

    // on unmount, revert
    return () => {
      document.documentElement.style.overflow = pre;
      document.documentElement.style.overscrollBehaviorBlock = preOverscroll;
    };
  }, []);
}
