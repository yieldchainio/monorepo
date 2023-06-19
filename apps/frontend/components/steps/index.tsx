/**
 * @notice
 * The main component used to conditonallity render a Step instance UI component.
 *
 * Based on the step's type.
 */

import { createContext, forwardRef } from "react";
import { StepProps } from "./types";
import { TriggerCompleteStep } from "./trigger/complete";
import { StepType } from "utilities/classes/step/types";
import { RegulerStep } from "./reguler";
import { TriggerStep } from "./trigger";
import { Step } from "utilities/classes/step";
import { StepContext } from "utilities/hooks/contexts/step-context";

/* eslint-disable react/display-name */
export const HeadStep = forwardRef<HTMLDivElement, StepProps>(
  ({ step, style, triggerComparison, canvasID, ...props }: StepProps, ref) => {
    /**
     * Switch case to return corresponding step component depending on the type (e.g Reguler, Condition, trigger)
     */

    switch (step.type) {
      case StepType.STEP:
        return (
          <StepContext.Provider
            value={{
              step,
              triggerComparison,
              style,
            }}
          >
            <RegulerStep ref={ref} {...props} />
          </StepContext.Provider>
        );

      case StepType.TRIGGER:
        return (
          <StepContext.Provider value={{ step, triggerComparison, style }}>
            <TriggerStep ref={ref} {...props} />
          </StepContext.Provider>
        );

      case StepType.CONDITION:
        return <div></div>;
    }
  }
);
