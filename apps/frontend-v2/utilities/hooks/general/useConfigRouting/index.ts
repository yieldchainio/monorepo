/**
 * A custom hook to extract the logic of routing the different configs,
 *
 * @param baseRoute - a string representing the base route. i.e for strategy it will be:
 *  /create/strategy
 *
 * @param routes - the routes to iterate
 *
 * @method next - Goes to the next config
 * @method prev - Goes to the prev config
 */

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export const useConfigRouting = (baseRoute: string, routes: string[]) => {
  // Keep a state of the current index
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Get the next router
  const router = useRouter();

  /**
   * Define next & prev functions
   */

  // next
  const next = useCallback(() => {
    if (currentIndex == routes.length - 1) return;
    router.replace(`${baseRoute}${routes[currentIndex + 1]}`);
    setCurrentIndex(currentIndex + 1);
  }, [currentIndex]);

  // Prev
  const prev = useCallback(() => {
    if (currentIndex == 0) return;
    router.replace(`${baseRoute}${routes[currentIndex - 1]}`);
    setCurrentIndex(currentIndex - 1);
  }, [currentIndex]);

  /**
   * UseEffect going to index 0 on mount
   */

  useEffect(() => {
    router.replace(`${baseRoute}${routes[currentIndex]}`);
  }, []);

  return { prev, next };
};
