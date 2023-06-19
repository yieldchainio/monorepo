/**
 * @notice
 * The main component used to conditonallity render a Step instance UI component.
 *
 * Based on the step's type.
 */

import { forwardRef, useContext } from "react";
import { StepProps } from "../types";
import { TriggerCompleteStep } from "./complete";
import { EmptyStep } from "../placeholder";
import { TriggerConfig } from "./config";
import { useStepContext } from "utilities/hooks/contexts/step-context";

/* eslint-disable react/display-name */
export const TriggerStep = forwardRef<HTMLDivElement, any>(
  ({ ...props }: any, ref) => {
    const { step } = useStepContext();
    /**
     * Switch case to return corresponding step component depending on state type
     */

    switch (step.state) {
      case "empty":
        return <EmptyStep ref={ref} {...props} />;

      case "initial":
        return <div></div>;

      case "config":
        return <TriggerConfig ref={ref} {...props} />;

      case "complete":
        return <TriggerCompleteStep ref={ref} {...props} />;
    }
  }
);
