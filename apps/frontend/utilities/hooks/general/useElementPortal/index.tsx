/**
 * useElementPortal
 *
 * @param id - A string representing the ID that was given to the element, so that it is selectable through the global document
 *
 * @returns canvasPortal - An HTML element passable to the tooltip (Or anyt other usecase) as a portal
 */

import { useMemo, useLayoutEffect, useState } from "react";

export function useElementPortal(id?: string): HTMLElement | undefined {
  /**
   * A state of the portal
   */
  const [portal, setPortal] = useState<HTMLElement | undefined>(undefined);

  /**
   * Run a layout effect to set the state when:
   * - The DOM mutates completely,
   * - The ID changes
   */

  useLayoutEffect(() => {
    setPortal((id ? document.getElementById(id) : undefined) || undefined);
  }, [id]);

  // Return it
  return portal;
}
