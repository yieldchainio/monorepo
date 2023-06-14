/**
 * @notice
 * A custom hook to use a dynamic zustand store locally
 */

import { useState } from "react";
import { StoreApi, UseBoundStore } from "zustand";

export const useDynamicStore = <T extends Record<any, any>, PROPS = undefined>(
  factoryFunction: (initialProps: PROPS) => UseBoundStore<StoreApi<T>>,
  initialProps: PROPS
) => {
  // A state for the store instance
  const [useStore] = useState<T>(factoryFunction(initialProps));

  // Return it
  return useStore;
};
