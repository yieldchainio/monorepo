/**
 * Constants for the strategies store
 */

import { IDBPDatabase, openDB } from "idb";
import { JSONStrategyStoreState, StrategyStoreState } from "./types";
import { idbStorage } from "utilities/infra/idb/idb-interface";
import { StateStorage } from "zustand/middleware";
import { YCClassifications, YCNetwork, YCToken } from "@yc/yc-models";
import { Step } from "utilities/classes/step";
import { useYCStore } from "../yc-data";

// Initiate the DB connection
const db = openDB("yieldchain", 1, {
  // Create a strategies store
  upgrade: (newDB) => {
    newDB.createObjectStore("strategies");
  },
});

/**
 * Seriallization and de-seriallization functions of the strategy store (To / From JSON)
 */

export const seriallizeStrategyStore = (statefulStoreObject: {
  state: StrategyStoreState;
}): JSONStrategyStoreState => {
  // Return a JSON store from a stateful stores

  const statefulStore = statefulStoreObject.state;

  const serialized = {
    id: statefulStore.id,
    isPublic: statefulStore.isPublic,
    depositToken: statefulStore.depositToken?.toJSON(),
    network: statefulStore?.network?.toJSON(),
    title: statefulStore.title,
    step: statefulStore?.step?.toJSON() || null,
  };
  console.log("Seriallized Store:", serialized);
  return serialized;
};

export const deseriallizeStrategyStore = (
  jsonStore: JSONStrategyStoreState
): StrategyStoreState => {
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
    step:
      jsonStore.step == null
        ? null
        : Step.fromJSONStep({ step: jsonStore.step, context: context }),
  };
};

/**
 * An object with functions to insert to localStorage using idb
 */
export const strategiesLocalStorage: StateStorage<JSONStrategyStoreState> =
  idbStorage<
    StrategyStoreState,
    JSONStrategyStoreState,
    JSONStrategyStoreState
  >(db as unknown as IDBPDatabase, "strategies", {
    serialize: seriallizeStrategyStore,
    deserialize: deseriallizeStrategyStore,
  });
