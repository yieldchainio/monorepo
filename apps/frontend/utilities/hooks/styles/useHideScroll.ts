import { useEffect, useState } from "react";

// Possible scroll directions
export enum Direction {
  UP,
  DOWN,
}

/**
 * useScrollDirection
 * Returns a scrolling direction of the user,
 * used by header/other sticky elements mostly
 * @returns @interface Direction
 */

export function useScrollDirection(): Direction | null {
  const [scrollDirection, setScrollDirection] = useState<Direction | null>(
    null
  );

  useEffect(() => {
    let lastScrollY: number = window.pageYOffset;

    function updateScrollDirection() {
      const scrollY: number = window.pageYOffset;
      const direction: Direction =
        scrollY > lastScrollY ? Direction.DOWN : Direction.UP;
      if (
        direction !== scrollDirection &&
        (scrollY - lastScrollY > 10 || scrollY - lastScrollY < -10)
      ) {
        setScrollDirection(direction);
      }
      lastScrollY = scrollY > 0 ? scrollY : 0;
    }
    window.addEventListener("scroll", updateScrollDirection); // add event listener
    return () => {
      window.removeEventListener("scroll", updateScrollDirection); // clean up
    };
  }, [scrollDirection]);

  return scrollDirection;
}
