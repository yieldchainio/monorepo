/**
 * useElementPortal
 *
 * @param id - A string representing the ID that was given to the element, so that it is selectable through the global document
 *
 * @returns canvasPortal - An HTML element passable to the tooltip (Or anyt other usecase) as a portal
 */

import { useMemo } from "react";

export const useElementPortal = (id?: string): HTMLElement | undefined => {
  /**
   * Memoize the portal
   */
  const portal = useMemo(() => (id ? document.getElementById(id) : undefined) || undefined, [id]);

  // Return it
  return portal;
};
