import { create } from "zustand";
import { LogsStore, UserLog } from "./types";
import { v4 as uuid } from "uuid";
import { AWSLogger } from "@yc/aws-models/bin/logger";
import { persist } from "zustand/middleware";
import { getErrorLog, getInfoLog, getSuccessLog, getWarningLog } from "./utils";

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
  id: uuid(),
  logs: [] as UserLog[],
  push: (logCallback: (length: string) => UserLog) => {
    set((state) => {
      const id = uuid();
      const log = logCallback(id);
      log.data && AWSLogger.log(get().id, log.data);

      if (log.lifespan instanceof Promise)
        log.lifespan.then(() => {
          state.remove(id);
        });
      else if (log.lifespan !== "immortal")
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

  /**
   * Utility functions to push errors, warnings & information as a shorthand
   */
  lazyPush: ({
    message,
    data = {},
    lifespan = 2000,
    type = "info",
  }: {
    message: string;
    data?: any;
    lifespan?: number | "immortal" | Promise<any>;
    type?: "info" | "error" | "warning" | "success";
  }) => {
    /**
     * Switch case for getter function of log
     */
    const logFunc =
      type === "info"
        ? getInfoLog
        : type === "error"
        ? getErrorLog
        : type === "warning"
        ? getWarningLog
        : type == "success"
        ? getSuccessLog
        : null;

    // Sufficient guard
    if (logFunc === null) return "";

    // Push it manually
    get().push((id: string) => {
      return {
        component: logFunc(message, id),
        id,
        lifespan,
        data,
      };
    });

    // Return the message (used for throwing if an error)
    return message;
  },
}));
