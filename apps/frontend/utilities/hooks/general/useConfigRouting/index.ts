/**
 * A custom hook to extract the logic of routing the different configs,
 *
 * @param baseRoute - a string representing the base route. i.e for strategy it will be:
 *  /app/create/strategy
 *
 * @param routes - the routes to iterate
 *
 * @method next - Goes to the next config
 * @method prev - Goes to the prev config
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { configProgressStep } from "utilities/hooks/stores/strategies/types";

export const useConfigRouting = (
  baseRoute: string,
  routes: configProgressStep[],
  constantNextCallback?: (index: number) => void
) => {
  // Keep a state of the current index
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Get the nextjs router
  const router = useRouter();

  /**
   * Define next & prev functions
   */

  // next
  const next = (callback?: (index: number) => void) => {
    constantNextCallback?.(currentIndex);
    if (currentIndex == routes.length - 1) return;
    if (callback) callback(currentIndex);
    router.replace(`${baseRoute}${routes[currentIndex + 1].route}`);
    setCurrentIndex(currentIndex + 1);
  };

  // Prev
  const prev = (callback?: (index: number) => void) => {
    if (currentIndex == 0) return;
    if (callback) callback(currentIndex);

    router.replace(`${baseRoute}${routes[currentIndex - 1].route}`);
    setCurrentIndex(currentIndex - 1);
  };

  // toRoute
  const toRoute = (route: string) => {
    // Get the index of it
    const index = routes.findIndex((_route) => _route.route === route);
    if (index == -1) return;
    // Route to it
    router.replace(`${baseRoute}${routes[index]}`);
    setCurrentIndex(index);
  };

  // Route by index
  const routeByIndex = (index: number) => {
    if (index < 0 || index >= routes.length) return;
    router.replace(`${baseRoute}${routes[index].route}`);
    setCurrentIndex(index);
  };
  // Initiate the routes (Routes to nearest step route marked "Active")
  const initRoute = (optionalRoutes?: configProgressStep[]) => {
    const latestCompleteRoute =
      (optionalRoutes || routes).findLastIndex(
        (config) => config.progressStep.state === "active"
      ) || 0;
    routeByIndex(latestCompleteRoute);
    setCurrentIndex(latestCompleteRoute);
  };
  /**
   * We memoize the progress and return it
   */
  const progress = useMemo(() => {
    return routes.length / currentIndex; // 50% progress == 0.5
  }, [currentIndex, routes, routes.length]);

  return {
    prev,
    next,
    toRoute,
    routeByIndex,
    progress,
    initRoute,
    currentIndex,
  };
};
