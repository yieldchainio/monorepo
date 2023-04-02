import { create } from "zustand";
import { LogsStore, UserLog } from "./types";
import { v4 as uuid } from "uuid";
import { AWSLogger } from "@yc/aws-models/bin/logger";

/**
 * @notice
 * @hook useLogger()
 * used to store global log messages that are user facing and are positioned absolutely, globally
 *
 * @param component - the actual react component to render
 * @param lifespan - the lifespan of the message in seconds / "immortal"
 */

// The actual store hook
export const useLogs = create<LogsStore>((set, get) => ({
  instance: new AWSLogger(uuid()),
  logs: [],
  push: (logCallback: (length: string) => UserLog) => {
    set((state) => {
      const id = uuid();
      const log = logCallback(id);
      log.data && get().instance.log(log.data);

      log.lifespan !== "immortal" &&
        setTimeout(() => {
          state.remove(id);
        }, log.lifespan);

      return {
        logs: [...state.logs, log],
      };
    });
  },
  remove: (id: string) => {
    set((state) => {
      const newArr = [...state.logs];
      const index = newArr.findIndex((item) => item.id == id);
      if (index !== -1) newArr.splice(index, 1);
      return {
        logs: newArr,
      };
    });
  },

  map: (logCallback: (item: UserLog, index: number, arr: UserLog[]) => any) => {
    return get().logs.map(logCallback);
  },

  destroy: () => {
    set(() => {
      return {
        logs: [],
      };
    });
  },
}));
