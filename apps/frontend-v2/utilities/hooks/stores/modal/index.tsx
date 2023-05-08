import React from "react";
import { create } from "zustand";
import { v4 as uuid } from "uuid";
import { ModalWrapper } from "components/modal-wrapper";
/**
 * @notice
 * @hook useModals()
 * used to store global modals positioned absolutely on the root
 */

// Interface for a modal
interface GlobalModal {
  component: React.ReactNode;
  id?: string;
  activeOn?: (`/${string}` | "*")[];
}

// The interface for this store
interface ModalsStore {
  modals: GlobalModal[];
  push: (modalCallback: (length: number) => GlobalModal) => void;
  remove: (index: number) => void;
  purge: (pathName: `/${string}`) => void;
  destroy: () => void;
  exists: (id: string) => boolean;
  lazyPush: (modalComponent: React.ReactNode) => void;
  findIndexByID: (id: string) => number;
}

// The actual store hook
export const useModals = create<ModalsStore>((set, get) => ({
  modals: [],
  push: (modalCallback: (len: number) => GlobalModal) => {
    // if (typeof window !== "undefined")
    //   document.documentElement.style.overflowY = "hidden";
    set((state) => {
      return {
        modals: [...state.modals, modalCallback(state.modals.length)],
      };
    });
  },
  remove: (index: number) => {
    if (typeof window !== "undefined")
      document.documentElement.style.overflowY = "scroll";
    set((state) => {
      const newArr = [...state.modals];
      newArr.splice(index, 1);
      return {
        modals: newArr,
      };
    });
  },
  purge: (pathName: `/${string}`) => {
    set((state) => {
      return {
        modals: [
          ...state.modals.filter(
            (modal) =>
              modal.activeOn?.includes(pathName) ||
              modal.activeOn?.includes("*")
          ),
        ],
      };
    });
  },

  destroy: () => {
    set((state) => {
      return {
        modals: [],
      };
    });
  },

  exists: (id: string): boolean => {
    return get().modals.some((modal) => modal.id === id);
  },

  findIndexByID: (id: string) => {
    return get().modals.findIndex((modal) => modal.id == id);
  },

  lazyPush: (modalComponent: React.ReactNode) => {
    const prevModals = get().modals;
    set({
      modals: [
        ...prevModals,
        {
          component: (
            <ModalWrapper modalKey={prevModals.length}>
              {modalComponent}
            </ModalWrapper>
          ),
          id: uuid(),
        },
      ],
    });
  },
}));