/**
 * A custom hook that combines usEffect and useState,
 * @param initialState - the initial useState state
 * @param effectCallback - the callback to trigger in useEffect when the state changes
 * @returns [state, setState]
 */

import { useEffect, useState } from "react";

export const useStateEffect = <T>(
  initialState: T,
  callback: (state?: T) => any,
  stateHook: (initialState: T) => [state]
) => {
  const [state, setState] = useState<T>(initialState);
  useEffect(() => {
    callback(state);
  }, [state]);

  return [state, setState];
};
