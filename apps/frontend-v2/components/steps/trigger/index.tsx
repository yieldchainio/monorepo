/**
 * @notice
 * The main component used to conditonallity render a Step instance UI component.
 *
 * Based on the step's type.
 */

import { forwardRef } from "react";
import { StepProps } from "../types";
import { TriggerCompleteStep } from "./complete";
import { EmptyStep } from "../placeholder";
import { TriggerConfig } from "./config";

export const TriggerStep = forwardRef<HTMLDivElement, StepProps>(
  ({ step, style, triggerComparison, canvasID, ...props }: StepProps, ref) => {
    /**
     * Switch case to return corresponding step component depending on state type
     */

    switch (step.state) {
      case "empty":
        return (
          <EmptyStep
            step={step}
            style={style}
            triggerComparison={triggerComparison}
            ref={ref}
            {...props}
            canvasID={canvasID}
          />
        );

      case "initial":
        return <div></div>;

      case "config":
        return (
          <TriggerConfig
            step={step}
            style={style}
            triggerComparison={triggerComparison}
            ref={ref}
            {...props}
            canvasID={canvasID}
          />
        );

      case "complete":
        return (
          <TriggerCompleteStep
            step={step}
            style={style}
            triggerComparison={triggerComparison}
            ref={ref}
            {...props}
            canvasID={canvasID}
          />
        );
    }
  }
);
