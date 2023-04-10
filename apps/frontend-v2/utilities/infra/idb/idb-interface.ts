/**
 * Interface for IDB to be used mainly with zustand
 */

import { IDBPDatabase } from "idb";
import { StateStorage } from "zustand/middleware";
import { IDBOption } from "./types";

export const idbStorage: <T = any, R = T>(
  dbInstance: IDBPDatabase | Promise<IDBPDatabase>,
  storeName: string,
  options?: IDBOption<any>
) => StateStorage = <T = any, R = T>(
  dbInstance: IDBPDatabase | Promise<IDBPDatabase>,
  storeName: string,
  options: IDBOption<T> = {
    serialize: (value: T) => value,
    deserialize: (value: T) => value,
  }
) => ({
  getItem: async (key: string): Promise<T> => {
    // Await it if not already
    if (dbInstance instanceof Promise) {
      await dbInstance.then((res) => (dbInstance = res as IDBPDatabase));
    }
    return await options.deserialize(
      await (dbInstance as IDBPDatabase).get(storeName, key)
    );
  },
  setItem: async (key: string, value: T): Promise<any> => {
    // Await it if not already
    if (dbInstance instanceof Promise) {
      await dbInstance.then((res) => {
        dbInstance = res;
      });
    }

    return await (dbInstance as IDBPDatabase).put(
      storeName,
      options.serialize(value),
      key
    );
  },
  removeItem: async (key: string): Promise<void> => {
    // Await it if not already
    if (dbInstance instanceof Promise) {
      await dbInstance.then((res) => (dbInstance = res));
    }
    return await (dbInstance as IDBPDatabase).delete(storeName, key);
  },
});
