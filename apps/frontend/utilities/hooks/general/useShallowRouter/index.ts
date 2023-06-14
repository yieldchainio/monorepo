/**
 * A hook to ease the use of "shallow"-like routing.
 */

import {
  usePathname,
  useSearchParams,
  ReadonlyURLSearchParams,
} from "next/navigation";
import { useEffect } from "react";

/**
 * The hook
 * @param onPathChange - - A callback that takes in the pathname, and optionally,
 * the URL params as well - invoked by our useEffect every time either one changes
 */
export const useShallowRouter = (
  onPathChange: (
    pathname: string,
    params?: ReadonlyURLSearchParams
  ) => any | void
): void => {
  // Get a state of the current pathname
  const pathname = usePathname();

  // Get a state of the current params
  const params = useSearchParams();

  // A useEffect listening for both, invoking the provided callback
  useEffect(() => {
    onPathChange(pathname, params);
  }, [pathname, params]);

  return;
};
