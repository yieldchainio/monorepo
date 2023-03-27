"use client";
/**
 * A component rendered in the background, listening for
 * shallow routes
 */

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useModals } from "utilities/hooks/stores/modal";

export const ShallowRouter = () => {
  // Get the state for the global modals
  const purge = useModals((state) => state.purge);

  // Get the state for the URL
  const path = usePathname();

  // Listen for changes
  useEffect(() => {
    // We call purge and input the current path.
    // This will delete all items out of the array that do not
    // have the current path in their persistance dependencies
    purge(path as `/${string}`);
  }, [path]);
  return <></>;
};
