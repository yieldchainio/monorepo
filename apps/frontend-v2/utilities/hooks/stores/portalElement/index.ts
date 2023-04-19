/**
 * @notice
 * A custom store which is supposed to be reused,
 * and provides a way of wrapping context around some children
 * in order to propagate a semi-global portaling context - i.e,
 * an element state which is set by some parent and consumed by the other children.
 *
 * Instead of drilling some prop to provide the portal/the ID of it, they can
 * simply use the store and access the portal that they are WRAPPED by,
 * so it is not limited to a single portal throughout the entire app
 */

import { create, createStore } from "zustand";

export interface PortalContextStore {
  portal: HTMLDivElement | null;
  setPortal: (element: HTMLDivElement) => void;
}

export const createPortalContext = () =>
  createStore<PortalContextStore>((set, get) => ({
    portal: null,
    setPortal: (element: HTMLDivElement) => set(() => ({ portal: element })),
  }));
