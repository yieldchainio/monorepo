/**
 * Main "complete" step component,
 * @param step - The step instance that we should render
 * @param size - StepSizing enum proprety, we decide which UI component to render based on this
 */

import { StepSizing, StepType } from "utilities/classes/step/types";
import { CompleteStepProps } from "./types";
import { SmallCompleteStep } from "./reguler/small";
import { MediumCompleteStep } from "./reguler/medium";
import { forwardRef } from "react";
import { SmallCompleteTrigger } from "./trigger/small";
import { MediumCompleteTrigger } from "./trigger/medium";

export const CompleteStep = forwardRef<HTMLDivElement, CompleteStepProps>(
  ({ step, triggerComparison, ...props }: CompleteStepProps, ref) => {
    /**
     * Switch case to return corresponding step component depending on type & size
     */

    // For Reguler Steps
    if (step.type == StepType.STEP)
      switch (step.size) {
        case StepSizing.SMALL:
          return (
            <SmallCompleteStep
              step={step}
              ref={ref}
              {...props}
              triggerComparison={triggerComparison}
            />
          );

        case StepSizing.MEDIUM:
          return (
            <MediumCompleteStep
              step={step}
              ref={ref}
              {...props}
              triggerComparison={triggerComparison}
            />
          );
      }

    if (step.type == StepType.TRIGGER) {
      switch (step.size) {
        case StepSizing.SMALL:
          return (
            <SmallCompleteTrigger
              step={step}
              triggerComparison={triggerComparison}
              ref={ref}
              {...props}
            />
          );

        case StepSizing.MEDIUM:
          return (
            <MediumCompleteTrigger
              step={step}
              triggerComparison={triggerComparison}
              ref={ref}
              {...props}
            />
          );
      }
    }

    return null;
  }
);
