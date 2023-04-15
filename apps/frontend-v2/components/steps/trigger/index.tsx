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

export const TriggerStep = forwardRef<HTMLDivElement, StepProps>(
  ({ step, style, triggerComparison, ...props }: StepProps, ref) => {
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
          />
        );

      case "initial":
        return <div></div>;

      case "config":
        return <div></div>;

      case "complete":
        return (
          <TriggerCompleteStep
            step={step}
            style={style}
            triggerComparison={triggerComparison}
            ref={ref}
            {...props}
          />
        );
    }
  }
);
