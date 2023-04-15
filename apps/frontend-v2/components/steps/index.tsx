/**
 * @notice
 * The main component used to conditonallity render a Step instance UI component.
 *
 * Based on the step's type.
 */

import { forwardRef } from "react";
import { StepProps } from "./types";
import { TriggerCompleteStep } from "./trigger/complete";
import { StepType } from "utilities/classes/step/types";
import { RegulerStep } from "./reguler";
import { TriggerStep } from "./trigger";

export const HeadStep = forwardRef<HTMLDivElement, StepProps>(
  ({ step, style, triggerComparison, ...props }: StepProps, ref) => {
    /**
     * Switch case to return corresponding step component depending on the type (e.g Reguler, Condition, trigger)
     */

    switch (step.type) {
      case StepType.STEP:
        return (
          <RegulerStep
            step={step}
            style={style}
            ref={ref}
            triggerComparison={triggerComparison}
            {...props}
          />
        );

      case StepType.TRIGGER:
        return (
          <TriggerStep
            step={step}
            style={style}
            ref={ref}
            triggerComparison={triggerComparison}
            {...props}
          />
        );

      case StepType.CONDITION:
        return <div></div>;
    }
  }
);
