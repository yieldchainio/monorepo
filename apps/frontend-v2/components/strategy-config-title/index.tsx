"use client";
/**
 * Base component for the title of a config in the strategy creation
 */

import { ChildrenProvider } from "components/internal/render-children";
import { BaseComponentProps } from "components/types";

export const ConfigTitle = ({ children }: BaseComponentProps) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <ChildrenProvider
        textProps={{
          fontSize: 42,
          fontStyle: "bold",
        }}
      >
        {children}
      </ChildrenProvider>
    </div>
  );
};
