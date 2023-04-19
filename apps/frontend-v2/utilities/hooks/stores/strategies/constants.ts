/**
 * Constants for the strategies store
 */

import { IDBPDatabase, openDB } from "idb";
import {
  JSONStrategyStoreState,
  StrategyStoreConfigsUtilityState,
  StrategyStoreState,
} from "./types";
import { idbStorage } from "utilities/infra/idb/idb-interface";
import { StateStorage } from "zustand/middleware";
import { YCClassifications, YCNetwork, YCToken } from "@yc/yc-models";
import { StepState, StepType } from "utilities/classes/step/types";
import { Step } from "utilities/classes/step";
import { useYCStore } from "../yc-data";
import { useYCStrategy } from "utilities/hooks/yc/useYCStrategy";
import { useStrategyStore } from ".";

// Initiate the DB connection
const db =
  typeof window === "undefined"
    ? null
    : openDB("yieldchain", 1, {
        // Create a strategies store
        upgrade: (newDB) => {
          newDB.createObjectStore("strategies");
        },
      });

/**
 * Seriallization and de-seriallization functions of the strategy store (To / From JSON)
 */

export const seriallizeStrategyStore = (
  statefulStoreObject: string
): JSONStrategyStoreState => {
  // Return a JSON store from a stateful stores
  const seriallizeres = JSON.parse(statefulStoreObject).state;
  return JSON.parse(statefulStoreObject).state;
};

export const deseriallizeStrategyStore = (
  jsonStore: JSONStrategyStoreState
): StrategyStoreState & StrategyStoreConfigsUtilityState => {
  // We retreive the global context
  const context: YCClassifications = useYCStore.getState().context;

  // Return the Stateful store from the JSON Store
  return {
    id: jsonStore.id,
    isPublic: jsonStore.isPublic,
    depositToken: jsonStore.depositToken
      ? new YCToken(jsonStore.depositToken, context)
      : null,
    network: jsonStore.network
      ? new YCNetwork(jsonStore.network, context)
      : null,
    title: jsonStore.title,
    step: Step.fromJSONStep({ step: jsonStore.step, context: context }),

    strategyConfigs: useStrategyStore
      .getState()
      .strategyConfigs.map((defaultConfig, i) => {
        return {
          ...defaultConfig,
          progressStep: {
            ...defaultConfig.progressStep,
            state: jsonStore.strategyConfigs[i].progressStep.state,
          },
        };
      }),
  };
};

/**
 * An object with functions to insert to localStorage using idb
 */
export const strategiesLocalStorage: StateStorage & {
  getAll: () => Promise<JSONStrategyStoreState[]>;
} = idbStorage<StrategyStoreState, JSONStrategyStoreState>(
  db as unknown as IDBPDatabase,
  "strategies",
  {
    serialize: seriallizeStrategyStore,
    deserialize: deseriallizeStrategyStore,
  }
);

/**
 * Our strategy configs array - We save this here as a constant to add our conditions when serializng
 */
