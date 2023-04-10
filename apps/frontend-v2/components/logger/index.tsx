"use client";
import { Children } from "react";
/**
 * The main component which contains the user logs
 */

import { useLogs } from "utilities/hooks/stores/logger";

export const LoggerProvider = () => {
  // Get the global logs store
  const logs = useLogs();

  return (
    <div className="fixed w-full h-full flex flex-col items-center justify-start py-18 pointer-events-none gap-4 mt-[2vh] shadow-xl ">
      <div className="flex flex-col items-center jsutify-start pointer-events-none gap-4 ">
        {Children.map(
          logs.map((log) => log.component),
          (component) => {
            if (component === null) return component;
            return (
              <component.type
                {...component.props}
                className={"animate-log" + " " + component.props.className}
                removeSelf
              ></component.type>
            );
          }
        )}
      </div>
    </div>
  );
};
