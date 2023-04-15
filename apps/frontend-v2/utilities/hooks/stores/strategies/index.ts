/**
 * @notice
 * A persistant store for the strategies.
 *
 * Persists strategies drafts
 */

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  JSONStrategyStoreState,
  StrategyStore,
  StrategyStoreConfigsUtilityState,
  StrategyStoreState,
} from "./types";
import { v4 as uuid } from "uuid";
import { YCNetwork, YCToken } from "@yc/yc-models";

// Initiate the DB storage to the strategies store
import { strategiesLocalStorage } from "./constants";

// Generate the UUId that will represent the strategy
const startingID = uuid();

export const useStrategyStore = create<StrategyStore>()(
  persist(
    (set, get) => ({
      /**
       * @State
       */

      // UUID of the strategy
      id: startingID,

      // Privacy setting of the strategy (Public/Private)
      isPublic: true,

      // Deposit token of the strategy (DBToken)
      depositToken: null,

      // Network of the strategy (DBNetwork)
      network: null,

      // Title of the strategy
      title: null,

      // Step of the strategy (tree)
      step: null,

      /**
       * @Methods
       */

      // Set the entire config (useful for loading from local storage)
      setStrategy: (
        configs?: StrategyStoreState & StrategyStoreConfigsUtilityState
      ) => {
        // We might get undefined if consumer's intent is to load the existing strategy
        if (configs) {
          changeStoreID(configs.id);
          set(configs);
        }
      },

      // Set the title
      setTitle: (title: string) => {
        set({ title });
      },

      // Set the privacy of the strategy
      setPrivacy: (isPublic: boolean) => {
        set({ isPublic });
      },

      // Set the deposit token
      setDepositToken: (token: YCToken) => {
        set({ depositToken: token });
      },

      // Set the network
      setNetwork: (network: YCNetwork) => {
        set({ network });
        console.log("Strategy Store", get());
      },

      /**
       * @UX States & Methods
       */
      strategyConfigs: [
        {
          route: "/title",
          progressStep: {
            image: {
              dark: "/icons/title-light.svg",
              light: "/icons/title-dark.svg",
            },
            label: "Choose Title",
            state: "active",
          },
          condition: () =>
            !!get().title ? true : "Please Choose A Title To Continue",
        },
        {
          route: "/network",
          progressStep: {
            image: {
              dark: "/icons/network-light.svg",
              light: "/icons/network-dark.svg",
            },
            label: "Choose Network",
            state: "not_complete",
          },
          condition: () =>
            !!get().network ? true : "Please Choose A Network To Continue!",
        },
        {
          route: "/token",
          progressStep: {
            image: {
              dark: "/icons/token-light.svg",
              light: "/icons/token-dark.svg",
            },
            label: "Choose Token",
            state: "not_complete",
          },
          condition: () =>
            !!get().depositToken
              ? true
              : "Please Choose A Deposit Token To Continue",
        },
        {
          route: "/privacy",
          progressStep: {
            image: {
              dark: "/icons/privacy-light.svg",
              light: "/icons/privacy-dark.svg",
            },
            label: "Choose Privacy",
            state: "not_complete",
          },
          condition: () =>
            get().isPublic == true || get().isPublic === false
              ? true
              : "Please Choose Your Privacy To Continue",
        },
        {
          route: "/base",
          progressStep: {
            image: {
              dark: "/icons/seed-light.svg",
              light: "/icons/seed-dark.svg",
            },
            label: "Assemble Base Steps",
            state: "not_complete",
          },
          condition: () =>
            !!get().step
              ? true
              : "Please Choose Atleast One Base Step To Continue",
        },
        {
          route: "/steps",
          progressStep: {
            image: "",
            label: "Build Steps",
            state: "not_complete",
          },
          condition: () =>
            !!get().step ? true : "Please Choose Atleast One Step To Continue",
        },
      ],

      // Change hte state of a config route
      changeConfigRouteState: (
        index: number,
        newState: "complete" | "not_complete" | "active"
      ) => {
        const arr = get().strategyConfigs;
        arr[index].progressStep.state = newState;
        set({ strategyConfigs: arr });
      },
    }),

    {
      // Saved under this UUID as the key
      name: startingID,
      storage: createJSONStorage(() => strategiesLocalStorage),

      partialize: (state) => {
        return {
          id: state.id,
          isPublic: state.isPublic,
          depositToken: state.depositToken,
          network: state.network,
          title: state.title,
          step: state.step,
          strategyConfigs: state.strategyConfigs,
        };
      },
    }
  )
);

/**
 * A function used to manipulate the store's key (ID) programatically
 */
const changeStoreID = (newID: string) => {
  useStrategyStore.persist.setOptions({ name: newID });
};
