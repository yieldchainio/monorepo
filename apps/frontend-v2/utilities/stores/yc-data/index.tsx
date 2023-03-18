import { create } from "zustand";
import { YCClassifications, Endpoints } from "@yc/yc-models";

export interface YCContextStore {
  context: YCClassifications;
  refresh: (endpoint: Endpoints) => Promise<boolean>;
}
/**
 * The actual YC Store hook
 */
export const useYCStore = create<YCContextStore>((set, get) => ({
  // The context (YCClassifications instance)
  context: YCClassifications.getInstance(),
  // Refresh function to refresh
  refresh: async (endpoints: Endpoints[] | Endpoints) =>
    await get().context.refresh(endpoints),
}));

/**
 * An internal hook for managing the YC user signup state,
 * to avoid paralell execution by consumers of the ``useYCUser`` hook
 */

export interface YCUserInternalStore {
  isSigningUp: boolean;
  setIsSigningUp: (_signingUp: boolean) => void;
}

export const useInternalYCUser = create<YCUserInternalStore>((set, get) => ({
  isSigningUp: false,
  setIsSigningUp: (_signingUp: boolean) =>
    set({
      isSigningUp: _signingUp,
    }),
}));
