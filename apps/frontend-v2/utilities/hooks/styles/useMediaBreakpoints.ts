import { create, useStore } from "zustand";
import { MediaScreens } from "types/styles/media-breakpoints";
import { useEffect, useState } from "react";

export type UseMediaBreakpointsProps = {
  [value in MediaScreens]: any;
};

export interface useMediaBreakpointsStore {
  proprety: any;
  setProprety: (_proprety: any) => void;
}

export const MediaScreenSizes = {
  MOBILE: 576,
  TABLET: 768,
  LAPTOP: 1150,
  PC: 1920,
  LARGEPC: 2400,
};

/**
 * @notice
 * A custom hook to use media breakpoints,
 * receives an object that maps any amount of MediaScreens sizes to some propretry,
 * has a useEffect that listens for window sizing change, and when it changes,
 * we set a state corresponding to the proprety set to the matching breakpoint,
 * which we return.
 * @param propreties @
 */
export const useMediaBreakpoints = <T>(_propreties: {
  [key in MediaScreens]: T;
}) => {
  // We initiate the state
  const [proprety, setProprety] = useState<T>();

  // We sort the propreties in a state for ease of iteration
  const [propreties, setPropreties] = useState<[string, T][]>(
    Object.entries(_propreties).sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
  );

  // A useEffect listening for window size change
  useEffect(() => {
    // Handler for the resize
    const resizeHandler = () => {
      // We get the current width
      const currWidth: number = window.innerWidth;

      // WE iterate over each sizing field
      for (const [, pxSize] of Object.entries(MediaScreenSizes)) {
        // If the current with is less then or equal to the current breakpoint,
        // we set the prorety accordingly
        if (currWidth <= pxSize) {
          // We try to find a corresponding proprety to the screen size
          const correspondingProp: [string, T] | undefined = propreties.find(
            (prop) => parseInt(prop[0]) === pxSize
          );

          // If we did not find one, we continue to the next iteration
          if (!correspondingProp) continue;

          // We set the proprety
          setProprety(correspondingProp[1]);

          // We break the iteration (since we're working on max's breakpoints)
          break;
        }
      }
    };

    // Add a listener to the resize event
    window.addEventListener("resize", resizeHandler);
    return () => window.removeEventListener("resize", resizeHandler);
  }, []);
};

// The actual store hook
const useMediaBreakpointsStore = create<useMediaBreakpointsStore>((set) => ({
  proprety: "",
  setProprety: (_proprety: any) =>
    set((state) => {
      return {
        proprety: _proprety,
      };
    }),
}));
