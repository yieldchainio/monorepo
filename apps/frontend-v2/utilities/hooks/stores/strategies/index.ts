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
import { TriggerTypes, YCNetwork, YCToken } from "@yc/yc-models";

// Initiate the DB storage to the strategies store
import { strategiesLocalStorage } from "./constants";
import {
  StepState,
  StepType,
  TriggerConfigs,
} from "utilities/classes/step/types";
import { Step } from "utilities/classes/step";
import { TriggerConfig } from "components/steps/trigger/config";

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
      step: new Step(
        {
          state: "config" as StepState,
          type: StepType.TRIGGER,
          triggerType: TriggerTypes.AUTOMATION,
          triggerDescription: "Scheduled Trigger",
          triggerIcon: {
            dark: "/icons/timer-light.svg",
            light: "/icons/timer-dark.svg",
          },
          triggerConfig: TriggerConfigs.AUTOMATION,
        },
        true
      ),

      seedStep: new Step(
        {
          type: StepType.TRIGGER,
          state: "complete" as StepState,
          inflows: [get()?.depositToken].flatMap((token: YCToken | null) =>
            token ? [token] : []
          ),
          triggerType: TriggerTypes.DEPOSIT,
          triggerDescription: "When A Vault Deposit Happens",
          triggerIcon: {
            dark: "/icons/deposit-light.svg",
            light: "/icons/deposit-dark.svg",
          },
        },
        true
      ),

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
        // We also change the root seed step to have an inflow of this,
        // And set it's trigger data to the token (used by visuals)
        const root = get().seedStep;
        root.inflows = [token];
        root.data.trigger = { token: token.toJSON() };
        // And delete all children which have another token as their inflow
        for (const child of root.children)
          if (child.outflows.some((_token) => _token.id == token.id))
            root.removeChild(child.id);

        //

        // Set the actuak token, and also our step
        set({ depositToken: token, seedStep: root });
      },

      // Set the network
      setNetwork: (network: YCNetwork) => {
        if (network.id) {
          get().step.map((step) => (step.chainId = network.id));
          get().seedStep.map((step) => (step.chainId = network.id));
        }
        set({ network });
      },

      // Refresh the step state - trigger a rehydrate and setting after manually changing stuff about it
      rehydrateSteps: () => {
        set({ step: get().step, seedStep: get().seedStep });
        useStrategyStore.persist.rehydrate();
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
          route: "/seed",
          progressStep: {
            image: {
              dark: "/icons/seed-light.svg",
              light: "/icons/seed-dark.svg",
            },
            label: "Assemble Base Steps",
            state: "not_complete",
          },
          condition: () =>
            !!get().seedStep
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
      onRehydrateStorage: (state) => {
        // When the storage is hydrated,
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
