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
  ANY: 10000,
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
  [key in MediaScreens]?: T;
}): { proprety: T } => {
  // We initiate the state
  const [proprety, setProprety] = useState<T>();

  // We sort the propreties in a state for ease of iteration
  const [propreties, setPropreties] = useState<[number, T][]>(
    Object.entries(_propreties)
      .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
      .map((prop) => [parseInt(prop[0]), prop[1]])
  );

  // small useEffect to just update our propreties we got in props as they change
  useEffect(() => {
    setPropreties(
      Object.entries(_propreties)
        .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
        .map((prop) => [parseInt(prop[0]), prop[1]])
    );
  }, [JSON.stringify(_propreties)]);

  // A useEffect listening for window size change
  useEffect(() => {
    // Handler for the resize
    const resizeHandler = () => {
      // We get the current width
      const currWidth: number = window.innerWidth;

      // WE iterate over each sizing field
      for (const [pxSize, prop] of propreties) {
        // If the current with is less then or equal to the current breakpoint,
        // we set the prorety accordingly
        if (currWidth <= pxSize) {
          // We set the proprety
          setProprety(prop);
          return prop;
          // We break the iteration (since we're working on max's breakpoints)
          break;
        }
      }
    };

    // this useEffect only runs once on mount - we initiate the proprety
    setProprety(resizeHandler());

    // Add a listener to the resize event
    window.addEventListener("resize", resizeHandler);
    return () => window.removeEventListener("resize", resizeHandler);
  }, []);

  // We return the proprety
  return { proprety } as { proprety: T };
};

/**
 * Another custom hook for media breakpoints, but "raw" - i.e it simply returns the sizing, no custom props
 */

const getMediaScreenSize = (_size: number): keyof typeof MediaScreenSizes => {
  // Entries of the enum
  const screenSizesEntries: [string, number][] =
    Object.entries(MediaScreenSizes);

  // We iterate over them
  for (const [screenName, size] of screenSizesEntries) {
    // If the prop size is smaller than or equals to the current iteration size, we return the screenName
    if (_size <= size) return screenName as keyof typeof MediaScreenSizes;
  }

  // We return "LARGEPC" if none worked (must be really big)
  return "LARGEPC";
};

export const useRawMediaBreakpoints = () => {
  // State for keeping track of the breakpoints
  const [breakpoint, setBreakpoint] = useState<MediaScreens>();

  // useEffect listening to window resize
  useEffect(() => {
    // Handler for the resize
    const resizeHandler = () => {
      // We get the current width
      const currWidth: number = window.innerWidth;

      // We get the breakpoint, and set it
      setBreakpoint(MediaScreenSizes[getMediaScreenSize(currWidth)]);
    };

    // Add a listener to the resize event
    window.addEventListener("resize", resizeHandler);
    return () => window.removeEventListener("resize", resizeHandler);
  }, []);

  // We return the breakpunt
  return { breakpoint };
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
