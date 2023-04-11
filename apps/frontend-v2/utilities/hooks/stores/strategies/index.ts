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
       * @methods
       */

      // Set the entire config (useful for loading from local storage)
      setStrategy: (configs: StrategyStoreState) => {
        set(configs);
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
    }),
    {
      // Saved under this UUID as the key
      name: startingID,
      storage: createJSONStorage<StrategyStoreState, any>(
        () => strategiesLocalStorage,
        {
          serialize: (value) => value,
          deserialize: (value) => value,
        }
      ),

      partialize: (state) => {
        console.log("PArtiaillizing this state", state);
        return {
          id: state.id,
          isPublic: state.isPublic,
          depositToken: state.depositToken,
          network: state.network,
          title: state.title,
          step: state.step,
        };
      },
    }
  )
);
